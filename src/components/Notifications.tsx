
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  getUnreadNotificationCount,
  Notification
} from '@/utils/storage';

interface NotificationsProps {
  userId: string;
}

const NotificationItem: React.FC<{ notification: Notification; onRead: (id: string) => void }> = ({ 
  notification, 
  onRead 
}) => {
  // Format the date
  const formatDate = (date: Date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return notifDate.toLocaleDateString();
  };
  
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'follow':
        return <div className="w-8 h-8 rounded-full bg-soft-purple flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-edu-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>;
      case 'view':
        return <div className="w-8 h-8 rounded-full bg-soft-blue flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-edu-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-edu-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 7 17l-5-5" />
            <path d="m22 10-7.5 7.5L13 16" />
          </svg>
        </div>;
    }
  };

  return (
    <div 
      className={`p-3 mb-2 rounded-lg transition-colors flex items-start space-x-3 border-l-2 hover:bg-muted/50 cursor-pointer ${notification.read ? 'border-transparent' : 'border-edu-blue bg-muted/30'}`}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      {getNotificationIcon()}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${notification.read ? '' : 'font-medium'}`}>{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatDate(new Date(notification.createdAt))}</p>
      </div>
    </div>
  );
};

const NotificationsComponent: React.FC<NotificationsProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = () => {
    const userNotifications = getNotifications(userId);
    setNotifications(userNotifications);
    setUnreadCount(getUnreadNotificationCount(userId));
  };

  useEffect(() => {
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(userId);
    loadNotifications();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      // Auto mark as read when opening
      setTimeout(() => {
        handleMarkAllAsRead();
      }, 2000);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 min-w-4 rounded-full bg-edu-red text-white text-[10px] flex items-center justify-center px-1 font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-medium border-b flex justify-between items-center">
          <h3>Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-7 px-2"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          <div className="p-3">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification}
                  onRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Bell size={40} className="stroke-1 mb-2 opacity-20" />
                <p>No notifications yet</p>
                <p className="text-xs mt-1">When someone interacts with your profile, you'll see it here</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsComponent;
