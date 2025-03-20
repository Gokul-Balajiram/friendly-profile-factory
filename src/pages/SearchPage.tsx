
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SearchUsers from '@/components/SearchUsers';

const SearchPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen edu-bg-pattern py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h1 className="profile-header text-center mb-6">Search Users</h1>
          <SearchUsers />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
