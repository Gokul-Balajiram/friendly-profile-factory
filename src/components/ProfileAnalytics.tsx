
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Eye, Users } from 'lucide-react';
import { UserProfile } from '@/utils/storage';

interface ProfileAnalyticsProps {
  profile: UserProfile;
}

const ProfileAnalytics: React.FC<ProfileAnalyticsProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-slide-up">
      <Card className="p-4 flex items-center space-x-4 bg-soft-blue border border-edu-blue/10">
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-edu-blue/10">
          <Eye className="text-edu-blue" size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Profile Views</p>
          <h3 className="text-2xl font-bold">{profile.viewCount}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4 bg-soft-purple border border-edu-purple/10">
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-edu-purple/10">
          <Users className="text-edu-purple" size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Followers</p>
          <h3 className="text-2xl font-bold">{profile.followers.length}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4 bg-soft-green border border-edu-green/10">
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-edu-green/10">
          <User className="text-edu-green" size={24} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Following</p>
          <h3 className="text-2xl font-bold">{profile.following.length}</h3>
        </div>
      </Card>
    </div>
  );
};

export default ProfileAnalytics;
