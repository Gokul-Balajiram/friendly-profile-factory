
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getProfiles } from '@/utils/storage';
import ProfileForm from '@/components/ProfileForm';

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [recentProfiles, setRecentProfiles] = useState([]);
  
  useEffect(() => {
    if (currentUser) {
      navigate('/profile');
    }
    
    // Get a few profiles to display
    const profiles = getProfiles().slice(0, 3);
    setRecentProfiles(profiles);
  }, [currentUser, navigate]);
  
  return (
    <div className="min-h-screen edu-bg-pattern">
      <div className="relative overflow-hidden">
        {/* Floating shapes for kid-friendly design */}
        <div className="absolute top-20 left-10 w-16 h-16 rounded-xl bg-edu-blue/20 animate-bounce-soft" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-edu-green/20 animate-bounce-soft" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-edu-yellow/20 animate-bounce-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-60 right-1/4 w-14 h-14 rounded-xl bg-edu-purple/20 animate-bounce-soft" style={{ animationDelay: '1.5s' }}></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-slide-down">
              <div className="inline-block px-3 py-1 rounded-full bg-edu-blue/10 text-edu-blue text-sm font-medium mb-4">
                Welcome to Kid's Learning Profile
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                Create Your <span className="text-edu-blue">Learning Profile</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Build a personalized profile to showcase your skills and track your learning journey.
              </p>
            </div>
            
            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left side - Create profile form */}
              <div className="flex-1 animate-fade-in">
                <Card className="rounded-2xl shadow-lg overflow-hidden border-0">
                  <CardContent className="p-8">
                    <h2 className="profile-header text-center mb-8">Create Your Profile</h2>
                    <ProfileForm />
                  </CardContent>
                </Card>
              </div>
              
              {/* Right side - Features and sample profiles */}
              <div className="flex-1 space-y-8 animate-slide-up">
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-full bg-soft-blue flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-edu-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Profile</h3>
                    <p className="text-muted-foreground">Create your unique profile with a photo, bio, and skills showcase.</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-full bg-soft-green flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-edu-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Showcase Skills</h3>
                    <p className="text-muted-foreground">Display your talents and abilities with colorful skill tags.</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-full bg-soft-purple flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-edu-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Privacy Controls</h3>
                    <p className="text-muted-foreground">Choose to make your profile public or private as needed.</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                    <div className="w-12 h-12 rounded-full bg-soft-yellow flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-edu-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                    <p className="text-muted-foreground">Monitor your profile analytics and learning journey.</p>
                  </div>
                </div>
                
                {/* Sample profiles */}
                {recentProfiles.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                    <h3 className="text-lg font-semibold mb-4">Recent Profiles</h3>
                    
                    <div className="space-y-4">
                      {recentProfiles.map(profile => (
                        <div key={profile.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                            {profile.imageUrl ? (
                              <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-lg font-bold text-muted-foreground">{profile.name.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{profile.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {profile.skills.slice(0, 2).join(', ')}
                              {profile.skills.length > 2 && '...'}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/view-profile/${profile.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
