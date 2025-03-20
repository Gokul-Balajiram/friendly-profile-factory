
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileById, getCurrentUser } from '@/utils/storage';
import ProfileView from '@/components/ProfileView';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const fetchedProfile = getProfileById(id);
    
    if (!fetchedProfile) {
      navigate('/');
      return;
    }
    
    setProfile(fetchedProfile);
    setIsLoading(false);
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen edu-bg-pattern flex items-center justify-center">
        <div className="animate-pulse">
          <div className="rounded-full bg-muted h-16 w-16"></div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen edu-bg-pattern py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-start mb-8">
            <Button 
              variant="ghost" 
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <h1 className="profile-header mb-4">Profile Not Found</h1>
            <p className="mb-4">The profile you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if profile is private and not owned by current user
  const isPrivateAndNotOwned = profile.isPrivate && 
    (!currentUser || currentUser.id !== profile.id);
  
  return (
    <div className="min-h-screen edu-bg-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-start mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </div>
        
        {isPrivateAndNotOwned ? (
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-6">
                <Lock size={48} className="text-muted-foreground" />
              </div>
            </div>
            <h1 className="profile-header mb-4">Private Profile</h1>
            <p className="mb-4">This profile is set to private by the user.</p>
          </div>
        ) : (
          <ProfileView 
            profile={profile} 
            isOwnProfile={currentUser ? currentUser.id === profile.id : false} 
          />
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
