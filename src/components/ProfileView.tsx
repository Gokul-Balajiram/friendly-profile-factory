import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Lock, UserPlus, Check, Edit, LogOut, UserX } from 'lucide-react';
import { UserProfile, viewProfile, toggleFollow, isFollowing, deleteProfile } from '@/utils/storage';
import { Link, useNavigate } from 'react-router-dom';
import SkillTag from './SkillTag';
import ProfileAnalytics from './ProfileAnalytics';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface ProfileViewProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, isOwnProfile }) => {
  const navigate = useNavigate();
  const [following, setFollowing] = useState(isFollowing(profile.id));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  
  // Generate a random color for each skill for consistent display
  const skillColors = ['blue', 'green', 'purple', 'pink', 'yellow', 'teal', 'orange'] as const;
  
  // Record the view
  React.useEffect(() => {
    if (!isOwnProfile) {
      viewProfile(profile.id);
    }
  }, [profile.id, isOwnProfile]);
  
  const handleFollow = async () => {
    try {
      setLoadingFollow(true);
      const newFollowState = toggleFollow(profile.id);
      setFollowing(newFollowState);
      toast.success(newFollowState ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoadingFollow(false);
    }
  };
  
  const handleDeleteProfile = () => {
    try {
      deleteProfile(profile.id);
      toast.success("Profile deleted successfully");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting profile");
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('edu_current_user');
    navigate('/');
    toast.success("Logged out successfully");
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header with profile photo and main actions */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 profile-card">
        <div className="relative">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {profile.imageUrl ? (
              <img 
                src={profile.imageUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-bold text-muted-foreground">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          {profile.isPrivate && (
            <div className="absolute bottom-0 right-0 bg-edu-blue text-white rounded-full p-2 shadow-md">
              <Lock size={16} />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
          <p className="text-muted-foreground mb-4">{profile.email}</p>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
            {isOwnProfile ? (
              <>
                <Button as={Link} to="/edit-profile" variant="default" className="gap-2">
                  <Edit size={16} />
                  Edit Profile
                </Button>
                
                <Button variant="outline" className="gap-2" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </Button>
                
                <Button 
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <UserX size={16} />
                  Delete
                </Button>
              </>
            ) : (
              <Button
                variant={following ? "outline" : "default"}
                className="gap-2"
                onClick={handleFollow}
                disabled={loadingFollow}
              >
                {following ? (
                  <>
                    <Check size={16} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div className="profile-card">
        <h2 className="profile-subheader mb-4">About Me</h2>
        {profile.bio ? (
          <p className="whitespace-pre-wrap">{profile.bio}</p>
        ) : (
          <p className="text-muted-foreground italic">No bio provided yet.</p>
        )}
      </div>
      
      {/* Skills */}
      <div className="profile-card">
        <h2 className="profile-subheader mb-4">Skills</h2>
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap">
            {profile.skills.map((skill, index) => (
              <SkillTag
                key={index}
                skill={skill}
                color={skillColors[index % skillColors.length]}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No skills listed yet.</p>
        )}
      </div>
      
      {/* Analytics - only for own profile */}
      {isOwnProfile && (
        <div className="space-y-4">
          <h2 className="profile-subheader">Profile Analytics</h2>
          <ProfileAnalytics profile={profile} />
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              profile and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileView;
