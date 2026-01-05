import { useState, useEffect } from 'react';
// import { messages as initialMessages } from '../../data/admin-data'; // Replaced by dynamic
import { database } from '../../firebase';
import { ref, onValue, update, remove, serverTimestamp, push } from 'firebase/database';
import { Envelope, EnvelopeOpen, Trash, MagnifyingGlass, ChatCircleDots, ArrowLeft } from 'phosphor-react';
import clsx from 'clsx';
import TitleComponent from '../../components/titleComponent/titleComponent';
import ThemeButton from '../../components/themeButton/themeButton';
import { useToast } from '../../context/toast-context';

const MessageManager = () => {
    const { showToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [search, setSearch] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.keys(data)
                    .map(key => ({ id: key, ...data[key] }))
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Derived state
    const filteredMessages = messages.filter(msg => {
        const matchesFilter = filter === 'all'
            ? true
            : filter === 'unread' ? !msg.read
                : msg.read;
        const matchesSearch =
            msg.sender.toLowerCase().includes(search.toLowerCase()) ||
            msg.email.toLowerCase().includes(search.toLowerCase()) ||
            msg.subject.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const selectedMessage = messages.find(m => m.id === selectedMessageId) || null;

    const toggleReadStatus = async (id, currentStatus) => {
        try {
            await update(ref(database, `messages/${id}`), { read: !currentStatus });
            // Local state update handled by onValue listener auto-sync
        } catch (error) {
            showToast("Failed to update status", "error");
        }
    };

    const deleteMessage = async (id) => {
        if (confirm("Are you sure you want to delete this message?")) {
            try {
                await remove(ref(database, `messages/${id}`));
                if (selectedMessageId === id) setSelectedMessageId(null);
                showToast("Message deleted", "error");
            } catch (error) {
                showToast("Failed to delete message", "error");
            }
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            showToast("Please enter a reply message", "error");
            return;
        }

        setSending(true);
        try {
            // Push new reply to 'replies' collection under the message
            const replyData = {
                message: replyText,
                sender: 'admin',
                date: new Date().toLocaleDateString(),
                timestamp: serverTimestamp()
            };

            await push(ref(database, `messages/${selectedMessage.id}/replies`), replyData);

            // Update main message status
            await update(ref(database, `messages/${selectedMessage.id}`), {
                status: 'Replied',
                repliedAt: serverTimestamp(),
                read: true, // Mark as read (Admin read)
                clientRead: false // User hasn't read the new reply
            });

            showToast("Reply sent successfully!");
            setReplyText('');
        } catch (error) {
            console.error(error);
            showToast("Failed to send reply", "error");
        }
        setSending(false);
    };

    const unreadCount = messages.filter(m => !m.read).length;

    // Avatar Color Generator
    const getAvatarColor = (name) => {
        const colors = [
            'bg-gradient-to-br from-purple-400 to-purple-600',
            'bg-gradient-to-br from-blue-400 to-blue-600',
            'bg-gradient-to-br from-green-400 to-green-600',
            'bg-gradient-to-br from-pink-400 to-pink-600',
            'bg-gradient-to-br from-orange-400 to-orange-600',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="space-y-6 animate-fade-in-down pb-10">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <TitleComponent type="h2">Messages</TitleComponent>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        Inbox from Contact Form
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Main Inbox Container */}
            <div className="flex h-[calc(100vh-14rem)] bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                {/* List Sidebar */}
                <div className={`w-full md:w-2/5 lg:w-1/3 border-r border-gray-100 flex flex-col ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    {/* Search & Filters */}
                    <div className="p-5 border-b border-gray-100 space-y-4 bg-gray-50/50">
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Pill Tabs */}
                        <div className="flex bg-gray-100/80 p-1 rounded-xl">
                            {['all', 'unread', 'read'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={clsx(
                                        "flex-1 px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all",
                                        filter === f
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <ChatCircleDots size={48} className="mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No messages found.</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessageId(msg.id);
                                        setReplyText(''); // Always clear sort reply text for new selection. Older replies are in the thread.
                                        if (!msg.read) toggleReadStatus(msg.id, msg.read);
                                    }}
                                    className={clsx(
                                        "p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50/80 relative group",
                                        selectedMessageId === msg.id && "bg-primaryLight/30 border-l-4 border-l-primary"
                                    )}
                                >
                                    {!msg.read && (
                                        <div className="absolute left-2 top-6 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                    )}

                                    <div className="flex items-start gap-3 ml-3">
                                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm", getAvatarColor(msg.sender))}>
                                            {msg.sender.charAt(0)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={clsx("text-sm font-Merriwheather truncate", !msg.read ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
                                                    {msg.sender}
                                                </h4>
                                                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{msg.date}</span>
                                            </div>
                                            <p className={clsx("text-sm truncate mb-1", !msg.read ? "font-semibold text-gray-700" : "text-gray-600")}>
                                                {msg.subject}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate leading-tight">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Content View */}
                <div className={`w-full md:w-3/5 lg:w-2/3 flex flex-col ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    {selectedMessage ? (
                        <>
                            {/* Message Toolbar */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                                <button
                                    onClick={() => setSelectedMessageId(null)}
                                    className="md:hidden flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors font-medium"
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <div className="flex gap-2 ml-auto">
                                    <button
                                        onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.read)}
                                        className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={selectedMessage.read ? "Mark as Unread" : "Mark as Read"}
                                    >
                                        {selectedMessage.read ? <Envelope size={20} weight="duotone" /> : <EnvelopeOpen size={20} weight="duotone" />}
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash size={20} weight="duotone" />
                                    </button>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                                <TitleComponent type="h3" className="mb-6 leading-snug">
                                    {selectedMessage.subject}
                                </TitleComponent>

                                {/* Original User Message */}
                                <div className="flex items-start gap-4 mb-8 p-5 bg-white rounded-xl border border-gray-100 shadow-sm relative">
                                    <div className="absolute top-4 right-4 text-xs text-gray-400 font-medium px-2 py-1 bg-gray-50 rounded-lg">Original Message</div>
                                    <div className={clsx("w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0", getAvatarColor(selectedMessage.sender))}>
                                        {selectedMessage.sender.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-base font-Merriwheather font-bold text-gray-900">
                                                    {selectedMessage.sender}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-mono">{selectedMessage.email}</span>
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 mr-20">{selectedMessage.date}</p>
                                        </div>
                                        <div className="prose max-w-none text-gray-700 leading-relaxed mt-4">
                                            {selectedMessage.message.split('\n').map((line, i) => (
                                                <p key={i} className="mb-2">{line || '\u00A0'}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider for Replies */}
                                {(selectedMessage.replies || selectedMessage.adminReply) && (
                                    <div className="relative flex items-center py-4 mb-4">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Conversation History</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                )}

                                {/* Legacy Admin Reply (Backwards Compatibility) */}
                                {selectedMessage.adminReply && !selectedMessage.replies && (
                                    <div className="flex items-start gap-4 mb-6 flex-row-reverse animate-fade-in-up">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                            A
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4 inline-block text-left max-w-[90%] md:max-w-[80%]">
                                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{selectedMessage.adminReply}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 mr-2">
                                                Admin • {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleDateString() : 'Replied'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic Replies List */}
                                {selectedMessage.replies && Object.values(selectedMessage.replies).map((reply, index) => (
                                    <div key={index} className="flex items-start gap-4 mb-6 flex-row-reverse animate-fade-in-up">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                            A
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4 inline-block text-left max-w-[90%] md:max-w-[80%]">
                                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{reply.message}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 mr-2">
                                                Admin • {reply.date || 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Box */}
                            <div className="p-5 border-t border-gray-100 bg-white space-y-3">
                                {selectedMessage.status === 'Replied' && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 px-1">
                                        <ChatCircleDots size={16} />
                                        <span>Continue the conversation:</span>
                                    </div>
                                )}
                                <textarea
                                    className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                                    rows="4"
                                    placeholder="Type your reply here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                                <div className="flex justify-end">
                                    <ThemeButton
                                        variant="primary"
                                        className="!px-6"
                                        onClick={handleReply}
                                        disabled={sending}
                                    >
                                        {sending ? 'Sending...' : 'Send Reply'}
                                    </ThemeButton>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <Envelope size={64} className="mb-4 opacity-20" weight="duotone" />
                            <p className="text-sm font-medium">Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageManager;
