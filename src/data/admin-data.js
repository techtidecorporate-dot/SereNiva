// Enhanced Mock Data for Admin Dashboard

export const adminStats = {
    appointments: { total: 154, today: 12, pending: 8, canceled: 5 },
    users: { total: 450, new: 15, active: 410 },
    therapists: { total: 12, active: 10, onLeave: 2 },
    revenue: { total: 45000, month: 5200, week: 1200 },
    messages: { total: 24, unread: 5 }
};

export const appointments = [
    { id: 101, customer: "Alice Green", service: "Swedish Massage", therapist: "Olivia Austin", date: "2025-10-25", time: "10:00 AM", status: "Confirmed", phone: "555-0101", notes: "Prefers firm pressure", price: 80 },
    { id: 102, customer: "Mark Brown", service: "Deep Tissue", therapist: "Amelia Hannan", date: "2025-10-25", time: "11:30 AM", status: "Pending", phone: "555-0102", notes: "First time client", price: 95 },
    { id: 103, customer: "Sophie Turner", service: "Hot Stone", therapist: "Kate Harris", date: "2025-10-26", time: "02:00 PM", status: "Completed", phone: "555-0103", notes: "", price: 120 },
    { id: 104, customer: "James White", service: "Facial Care", therapist: "Olivia Austin", date: "2025-10-26", time: "09:00 AM", status: "Cancelled", phone: "555-0104", notes: "Rescheduled to next week", price: 65 },
    { id: 105, customer: "Emily Clark", service: "Aromatherapy", therapist: "Unassigned", date: "2025-10-27", time: "03:00 PM", status: "Pending", phone: "555-0105", notes: "Allergic to lavender", price: 90 },
    { id: 106, customer: "Michael Scott", service: "Swedish Massage", therapist: "Olivia Austin", date: "2025-10-28", time: "10:00 AM", status: "Confirmed", phone: "555-0106", notes: "", price: 80 },
];

export const services = [
    {
        id: 1,
        name: "Swedish Massage",
        duration: "60 min",
        price: 80,
        category: "Massage",
        status: "Active",
        featured: true,
        description: "A gentle full-body massage that improves circulation and relieves muscle tension.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Deep Tissue Massage",
        duration: "60 min",
        price: 95,
        category: "Massage",
        status: "Active",
        featured: false,
        description: "Targets the deeper layers of muscle and connective tissue.",
        image: "https://images.unsplash.com/photo-1519823551278-64ac927acdbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Hot Stone Massage",
        duration: "90 min",
        price: 120,
        category: "Massage",
        status: "Active",
        featured: true,
        description: "Heated smooth stones are placed on key points on the body.",
        image: "https://images.unsplash.com/photo-1591343395082-e214716b7be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Basic Facial",
        duration: "45 min",
        price: 65,
        category: "Facial",
        status: "Active",
        featured: false,
        description: "Cleansing, exfoliating, and nourishing session for your face.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Aromatherapy",
        duration: "60 min",
        price: 90,
        category: "Massage",
        status: "Inactive",
        featured: false,
        description: "Massage therapy with essential oils (highly concentrated plant oils).",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
];

export const therapists = [
    { id: 1, name: "Olivia Austin", specialty: "Swedish Massage", status: "Active", phone: "555-1001", email: "olivia@sereniva.com", shift: "Morning (9AM - 2PM)" },
    { id: 2, name: "Amelia Hannan", specialty: "Deep Tissue", status: "Active", phone: "555-1002", email: "amelia@sereniva.com", shift: "Afternoon (1PM - 6PM)" },
    { id: 3, name: "Kate Harris", specialty: "Thai Massage", status: "On Leave", phone: "555-1003", email: "kate@sereniva.com", shift: "Morning (9AM - 2PM)" },
];

export const users = [
    { id: 1, name: "Alice Green", email: "alice@example.com", phone: "555-0101", joinDate: "2024-05-12", status: "Active" },
    { id: 2, name: "Mark Brown", email: "mark@example.com", phone: "555-0102", joinDate: "2024-06-20", status: "Active" },
    { id: 3, name: "Sophie Turner", email: "sophie@example.com", phone: "555-0103", joinDate: "2024-08-15", status: "Disabled" },
    { id: 4, name: "James White", email: "james@example.com", phone: "555-0104", joinDate: "2024-09-01", status: "Active" },
    { id: 5, name: "Emily Clark", email: "emily@example.com", phone: "555-0105", joinDate: "2024-09-10", status: "Active" },
];

export const reviews = [
    { id: 1, author: "Alice Green", rating: 5, service: "Swedish Massage", content: "Amazing experience! The ambiance was perfect.", status: "Approved", date: "2025-10-25" },
    { id: 2, author: "Mark Brown", rating: 4, service: "Deep Tissue", content: "Great but a bit painful.", status: "Pending", date: "2025-10-24" },
    { id: 3, author: "John Doe", rating: 1, service: "Facial", content: "Terrible service. Waited 20 mins.", status: "Rejected", date: "2025-10-20" },
    { id: 4, author: "Emily Clark", rating: 5, service: "Aromatherapy", content: "So relaxing, I fell asleep!", status: "Approved", date: "2025-10-22" },
];

export const messages = [
    { id: 1, sender: "John Doe", email: "john@test.com", subject: "Inquiry", message: "Do you offer couples massage packages and what is the pricing?", date: "2025-10-24", read: false },
    { id: 2, sender: "Jane Smith", email: "jane@test.com", subject: "Feedback", message: "Loved my session with Olivia yesterday. She is fantastic!", date: "2025-10-20", read: true },
    { id: 3, sender: "Bob Johnson", email: "bob@test.com", subject: "Cancellation", message: "I need to cancel my appointment for tomorrow appropriately.", date: "2025-10-18", read: true },
    { id: 4, sender: "Sarah Lee", email: "sarah@test.com", subject: "Partnership", message: "We are a local product supplier and would love to partner.", date: "2025-10-15", read: false },
    { id: 5, sender: "Mike Brown", email: "mike@test.com", subject: "Gift Card", message: "How do I purchase a digital gift card?", date: "2025-10-12", read: true },
];

export const blogPosts = [
    { id: 1, title: "Benefits of Massage Therapy", category: "Wellness", status: "Published", date: "2025-09-10", views: 1205 },
    { id: 2, title: "Top 5 Skincare Routines for Winter", category: "Beauty", status: "Draft", date: "2025-10-05", views: 0 },
    { id: 3, title: "Understanding Deep Tissue Massage", category: "Education", status: "Published", date: "2025-08-22", views: 890 },
];

// Service Reviews Data
export const serviceReviews = [
    {
        id: 1,
        reviewerName: "Alice Green",
        email: "alice@example.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        service: "Swedish Massage",
        rating: 5,
        reviewText: "Amazing experience! The therapist was incredibly skilled and the ambiance was perfect. I felt completely relaxed and rejuvenated after the session.",
        status: "Approved",
        date: "2025-10-25",
        reply: "Thank you so much for your wonderful feedback, Alice! We're thrilled you enjoyed your experience."
    },
    {
        id: 2,
        reviewerName: "Mark Brown",
        email: "mark@example.com",
        avatar: "https://i.pravatar.cc/150?img=2",
        service: "Deep Tissue Massage",
        rating: 4,
        reviewText: "Great massage, really helped with my back pain. The therapist knew exactly where the tension was. A bit painful at times but that's expected with deep tissue work.",
        status: "Approved",
        date: "2025-10-24",
        reply: null
    },
    {
        id: 3,
        reviewerName: "Sophie Turner",
        email: "sophie@example.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        service: "Hot Stone Massage",
        rating: 5,
        reviewText: "Absolutely divine! The heated stones melted away all my stress. Kate was wonderful and very attentive. Highly recommend this service.",
        status: "Approved",
        date: "2025-10-23",
        reply: null
    },
    {
        id: 4,
        reviewerName: "John Anderson",
        email: "john.a@example.com",
        avatar: "https://i.pravatar.cc/150?img=4",
        service: "Basic Facial",
        rating: 2,
        reviewText: "The facial was okay but I had to wait 20 minutes past my appointment time. Service quality was average at best.",
        status: "Pending",
        date: "2025-10-20",
        reply: null
    },
    {
        id: 5,
        reviewerName: "Emily Clark",
        email: "emily@example.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        service: "Aromatherapy Massage",
        rating: 5,
        reviewText: "So relaxing I literally fell asleep! The essential oils were heavenly and the massage technique was perfect. Will definitely be back.",
        status: "Approved",
        date: "2025-10-22",
        reply: "We're so happy you enjoyed the aromatherapy session, Emily! Can't wait to see you again."
    },
    {
        id: 6,
        reviewerName: "David Wilson",
        email: "david.w@example.com",
        avatar: "https://i.pravatar.cc/150?img=6",
        service: "Swedish Massage",
        rating: 3,
        reviewText: "Decent massage but the room temperature was too cold for my liking. Otherwise the therapist was professional.",
        status: "Pending",
        date: "2025-10-19",
        reply: null
    },
    {
        id: 7,
        reviewerName: "Sarah Mitchell",
        email: "sarah.m@example.com",
        avatar: "https://i.pravatar.cc/150?img=7",
        service: "Deep Tissue Massage",
        rating: 5,
        reviewText: "Best deep tissue massage I've ever had! The pressure was exactly what I needed. My chronic shoulder pain is finally gone!",
        status: "Approved",
        date: "2025-10-18",
        reply: null
    },
    {
        id: 8,
        reviewerName: "Tom Harris",
        email: "tom.h@example.com",
        avatar: "https://i.pravatar.cc/150?img=8",
        service: "Basic Facial",
        rating: 1,
        reviewText: "Terrible service. The products used irritated my skin and the staff was rude when I complained.",
        status: "Hidden",
        date: "2025-10-15",
        reply: null
    },
];

// Blog Reviews/Comments Data
export const blogReviews = [
    {
        id: 1,
        reviewerName: "Jessica Lee",
        email: "jessica@example.com",
        avatar: "https://i.pravatar.cc/150?img=9",
        blogTitle: "Benefits of Massage Therapy",
        commentText: "Great article! Really informative and well-written. I learned so much about the different benefits of regular massage therapy.",
        status: "Approved",
        date: "2025-10-21",
        reply: "Thank you, Jessica! We're glad you found it helpful."
    },
    {
        id: 2,
        reviewerName: "Robert Chen",
        email: "robert@example.com",
        avatar: "https://i.pravatar.cc/150?img=10",
        blogTitle: "Understanding Deep Tissue Massage",
        commentText: "This answered all my questions about deep tissue massage. Now I feel confident booking my first session!",
        status: "Approved",
        date: "2025-10-19",
        reply: null
    },
    {
        id: 3,
        reviewerName: "Linda Johnson",
        email: "linda@example.com",
        avatar: "https://i.pravatar.cc/150?img=11",
        blogTitle: "Benefits of Massage Therapy",
        commentText: "Could you write more about aromatherapy specifically? Would love to learn about different essential oils.",
        status: "Approved",
        date: "2025-10-17",
        reply: "Great suggestion, Linda! We'll add that to our content calendar."
    },
    {
        id: 4,
        reviewerName: "Michael Scott",
        email: "mscott@example.com",
        avatar: "https://i.pravatar.cc/150?img=12",
        blogTitle: "Top 5 Skincare Routines for Winter",
        commentText: "When will this article be published? Really looking forward to it!",
        status: "Pending",
        date: "2025-10-16",
        reply: null
    },
    {
        id: 5,
        reviewerName: "Amanda Parker",
        email: "amanda@example.com",
        avatar: "https://i.pravatar.cc/150?img=13",
        blogTitle: "Understanding Deep Tissue Massage",
        commentText: "Very helpful! I've been dealing with chronic pain and this gave me hope that massage therapy could help.",
        status: "Approved",
        date: "2025-10-14",
        reply: null
    },
    {
        id: 6,
        reviewerName: "SpamBot123",
        email: "spam@fake.com",
        avatar: "https://i.pravatar.cc/150?img=14",
        blogTitle: "Benefits of Massage Therapy",
        commentText: "Check out my website for cheap massage equipment!!! www.scam-site.com",
        status: "Pending",
        date: "2025-10-13",
        reply: null
    },
];

