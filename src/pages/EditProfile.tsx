import React, { useEffect, useState } from 'react';
import { getCurrentUser, updateProfile, UserProfile } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '@/components/ProfileForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/');
    } else {
      setProfile(user);
    }
  }, [navigate]);
  
  const handleSave = (updatedProfile: UserProfile) => {
    try {
      const result = updateProfile(updatedProfile);
      setProfile(result);
      toast.success("Profile updated successfully!");
      navigate('/profile');
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };
  
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
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h1 className="profile-header text-center mb-6">Edit Your Profile</h1>
          <ProfileForm existingProfile={profile} isEditing={true} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
