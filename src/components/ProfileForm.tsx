
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword, validateName, getPasswordStrength } from '@/utils/validation';
import { createProfile, UserProfile } from '@/utils/storage';
import ImageCropper from './ImageCropper';
import SkillTag from './SkillTag';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface ProfileFormProps {
  existingProfile?: UserProfile;
  isEditing?: boolean;
  onSave?: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ existingProfile, isEditing = false, onSave }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form fields
  const [name, setName] = useState(existingProfile?.name || '');
  const [email, setEmail] = useState(existingProfile?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [isPrivate, setIsPrivate] = useState(existingProfile?.isPrivate || false);
  const [imagePreview, setImagePreview] = useState<string | null>(existingProfile?.imageUrl || null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(existingProfile?.skills || []);
  
  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });
  
  // Helper functions for validation
  const validateForm = () => {
    const newErrors = {
      name: !validateName(name) ? 'Name must be at least 2 characters' : '',
      email: !validateEmail(email) ? 'Please enter a valid email address' : '',
      password: !isEditing && !validatePassword(password) ? 
        'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number' : '',
      confirmPassword: !isEditing && password !== confirmPassword ? 'Passwords do not match' : '',
      bio: bio.length > 300 ? 'Bio must be under 300 characters' : ''
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  const getPasswordFeedback = () => {
    if (!password) return null;
    
    const strength = getPasswordStrength(password);
    
    const strengthColor = {
      weak: 'bg-edu-red',
      medium: 'bg-edu-yellow',
      strong: 'bg-edu-green'
    };
    
    const strengthText = {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    };
    
    return (
      <div className="mt-1 flex items-center space-x-2">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div 
            className={`h-full ${strengthColor[strength]} transition-all duration-300`} 
            style={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}
          />
        </div>
        <span className="text-xs">{strengthText[strength]}</span>
      </div>
    );
  };
  
  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTempImage(event.target.result as string);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleCrop = (croppedImage: string) => {
    setImagePreview(croppedImage);
    setCropperOpen(false);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Skills handling
  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
    }
  };
  
  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput) {
      e.preventDefault();
      addSkill();
    }
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }
    
    try {
      if (isEditing && existingProfile && onSave) {
        // Update profile logic
        const updatedProfile: Partial<UserProfile> & { id: string } = {
          id: existingProfile.id,
          name,
          email,
          bio,
          isPrivate,
          skills,
          imageUrl: imagePreview || ''
        };
        
        onSave(updatedProfile as UserProfile);
      } else {
        // Create new profile
        const newProfile = createProfile({
          name,
          email,
          bio,
          imageUrl: imagePreview || '',
          skills,
          isPrivate,
          following: []
        });
        
        toast.success("Profile created successfully!");
        navigate('/profile');
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };
  
  // Colors for random skill assignment
  const skillColors = ['blue', 'green', 'purple', 'pink', 'yellow', 'teal', 'orange'] as const;
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center border-2 hover:border-primary cursor-pointer transition-all duration-200"
            onClick={triggerFileInput}
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={36} className="text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
          >
            {imagePreview ? 'Change Picture' : 'Upload Picture'}
          </Button>
        </div>
        
        {/* Basic Information */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="profile-label">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`profile-input ${errors.name ? 'border-destructive' : ''}`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="profile-label">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`profile-input ${errors.email ? 'border-destructive' : ''}`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
          
          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="profile-label">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`profile-input ${errors.password ? 'border-destructive' : ''}`}
                  placeholder="Create a password"
                />
                {getPasswordFeedback()}
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="profile-label">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`profile-input ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="bio" className="profile-label">Bio</Label>
            <span className={`text-xs ${bio.length > 300 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {bio.length}/300
            </span>
          </div>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`profile-input min-h-32 ${errors.bio ? 'border-destructive' : ''}`}
            placeholder="Tell us about yourself..."
          />
          {errors.bio && <p className="error-message">{errors.bio}</p>}
        </div>
        
        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills" className="profile-label">Skills</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="profile-input"
              placeholder="Add a skill (e.g., Drawing, Math, Science)"
            />
            <Button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim()}
            >
              Add
            </Button>
          </div>
          <div className="mt-3">
            {skills.length > 0 ? (
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    color={skillColors[index % skillColors.length]}
                    onRemove={() => removeSkill(index)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="flex items-center space-x-2 pt-4">
          <Switch
            id="private"
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
          <Label htmlFor="private" className="profile-label cursor-pointer">
            Make profile private
          </Label>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full profile-btn-primary">
            {isEditing ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </form>
      
      {/* Image Cropper */}
      {tempImage && (
        <ImageCropper
          image={tempImage}
          onCrop={handleCrop}
          onCancel={() => setCropperOpen(false)}
          open={cropperOpen}
        />
      )}
    </div>
  );
};

export default ProfileForm;
