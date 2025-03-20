
import React, { useEffect } from 'react';
import { getCurrentUser } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import ProfileView from '@/components/ProfileView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import NotificationsComponent from '@/components/Notifications';

const Profile = () => {
  const navigate = useNavigate();
  const profile = getCurrentUser();
  
  useEffect(() => {
    if (!profile) {
      navigate('/');
    }
  }, [profile, navigate]);
  
  if (!profile) {
    return null;
  }
  
  return (
    <div className="min-h-screen edu-bg-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
          
          <NotificationsComponent userId={profile.id} />
        </div>
        
        <ProfileView profile={profile} isOwnProfile={true} />
      </div>
    </div>
  );
};

export default Profile;
