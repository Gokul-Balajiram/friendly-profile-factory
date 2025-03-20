
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProfiles, UserProfile } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import { Search, UserSearch } from 'lucide-react';

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all profiles on component mount
    const profiles = getProfiles();
    setAllProfiles(profiles);
  }, []);

  useEffect(() => {
    // Filter profiles based on search term
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = allProfiles.filter(
      profile => 
        profile.name.toLowerCase().includes(term) || 
        profile.email.toLowerCase().includes(term) ||
        profile.skills.some(skill => skill.toLowerCase().includes(term))
    );
    
    setSearchResults(results);
  }, [searchTerm, allProfiles]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search by name, email or skills"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
        </div>
      </div>

      {searchTerm.trim() !== '' && searchResults.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <UserSearch size={40} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
          </CardContent>
        </Card>
      ) : (
        searchResults.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
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
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default SearchUsers;
