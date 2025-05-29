export interface MonthlyStat {
  name: string; // Month (e.g., "Jan", "Feb")
  views: number;
  engagement: number;
  followers: number;
}

export const exampleOverviewStats: MonthlyStat[] = [
  { name: "Jan", views: 4000, engagement: 2400, followers: 240 },
  { name: "Feb", views: 3000, engagement: 1398, followers: 210 },
  { name: "Mar", views: 2000, engagement: 9800, followers: 290 },
  { name: "Apr", views: 2780, engagement: 3908, followers: 340 },
  { name: "May", views: 1890, engagement: 4800, followers: 380 },
  { name: "Jun", views: 2390, engagement: 3800, followers: 410 },
  { name: "Jul", views: 3490, engagement: 4300, followers: 450 },
  { name: "Aug", views: 3200, engagement: 4100, followers: 480 },
  { name: "Sep", views: 3800, engagement: 4500, followers: 500 },
  { name: "Oct", views: 3900, engagement: 4700, followers: 530 },
  { name: "Nov", views: 4100, engagement: 5000, followers: 550 },
  { name: "Dec", views: 4300, engagement: 5200, followers: 580 },
];

export interface PlatformMetric {
  title: string;
  value: string;
  change: string;
  trending: "up" | "down" | "neutral"; // Assuming neutral is a possibility
  description: string;
}

export const examplePlatformMetrics: PlatformMetric[] = [
  {
    title: "Total Views",
    value: "1.2M",
    change: "+14.5%",
    trending: "up",
    description: "From last month",
  },
  {
    title: "Engagement Rate",
    value: "4.3%",
    change: "+2.1%",
    trending: "up",
    description: "From last month",
  },
  {
    title: "Subscribers",
    value: "12.5K",
    change: "+250",
    trending: "up",
    description: "From last month",
  },
  {
    title: "Watch Time (Hours)",
    value: "25.6K",
    change: "-3.2%",
    trending: "down",
    description: "From last month",
  },
];

export interface TopPost {
  id: number;
  title: string;
  views: string;
  engagement: string;
  platform: string;
  thumbnail: string;
  trending: boolean;
  channelAvatar?: string; // Optional, as seen in some examples
  channelName?: string; // Optional
}

export const exampleTopPosts: TopPost[] = [
  {
    id: 1,
    title: "10 Tips for Growing Your TikTok Following",
    views: "245.2K",
    engagement: "12.5K",
    platform: "TikTok",
    thumbnail: "https://images.pexels.com/photos/5417639/pexels-photo-5417639.jpeg?auto=compress&cs=tinysrgb&w=600",
    trending: true,
  },
  {
    id: 2,
    title: "How to Create Viral Instagram Reels",
    views: "180.5K",
    engagement: "9.8K",
    platform: "Instagram",
    thumbnail: "https://images.pexels.com/photos/7083936/pexels-photo-7083936.jpeg?auto=compress&cs=tinysrgb&w=600",
    trending: false,
  },
  {
    id: 3,
    title: "YouTube Shorts: The Next Big Thing?",
    views: "302.1K",
    engagement: "15.1K",
    platform: "YouTube",
    thumbnail: "https://images.pexels.com/photos/2265907/pexels-photo-2265907.jpeg?auto=compress&cs=tinysrgb&w=600",
    trending: true,
  },
  {
    id: 4,
    title: "Mastering LinkedIn Content Strategy",
    views: "95.7K",
    engagement: "4.2K",
    platform: "LinkedIn",
    thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
    trending: false,
  },
];

export interface RecentActivityItem {
  id: number;
  type: "comment" | "like" | "new_subscriber" | "new_video"; // Add other types as needed
  content?: string; // Optional, e.g., for comments
  user?: {
    name: string;
    avatar: string;
  };
  videoTitle?: string; // Optional, e.g., for likes on a video
  time: string;
  platform: string;
}

export const exampleRecentActivity: RecentActivityItem[] = [
  {
    id: 1,
    type: "comment",
    content: "Great video! Could you do a follow-up on audience targeting?",
    user: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
    },
    time: "2 hours ago",
    platform: "YouTube",
  },
  {
    id: 2,
    type: "like",
    user: {
      name: "Maria Garcia",
      avatar: "https://i.pravatar.cc/150?u=maria",
    },
    videoTitle: "My Latest Travel Vlog",
    time: "5 hours ago",
    platform: "YouTube",
  },
  {
    id: 3,
    type: "new_subscriber",
    user: {
      name: "Chris Lee",
      avatar: "https://i.pravatar.cc/150?u=chris",
    },
    time: "1 day ago",
    platform: "YouTube",
  },
  {
    id: 4,
    type: "new_video",
    videoTitle: "Unboxing the New Tech Gadget!",
    time: "2 days ago",
    platform: "YouTube",
  },
];

export interface ExampleYouTubeChannel {
  channelName: string;
  avatarUrl: string;
  subscriberCount: string; // Keep as string to match PlatformMetric 'value'
  isLinked: boolean; // To represent a demo linked state
  // Add the missing properties that youtube-channel-card expects
  channelTitle?: string;
  thumbnailUrl?: string;
  viewCount?: string;
  videoCount?: string;
}

export const exampleYouTubeChannelCard: ExampleYouTubeChannel = {
  channelName: "Demo Channel",
  channelTitle: "Demo Channel", // Add this for compatibility
  avatarUrl: "https://yt3.googleusercontent.com/ytc/AIdro_kO939bTRL3e0y2tGg_n5DR0hpL_H5XSHLs7lCgYw=s176-c-k-c0x00ffffff-no-rj",
  thumbnailUrl: "https://yt3.googleusercontent.com/ytc/AIdro_kO939bTRL3e0y2tGg_n5DR0hpL_H5XSHLs7lCgYw=s176-c-k-c0x00ffffff-no-rj", // Add this
  subscriberCount: "12.5K",
  viewCount: "1.2M", // Add this
  videoCount: "342", // Add this
  isLinked: true,
};
