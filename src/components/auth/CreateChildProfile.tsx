import { useState } from 'react';
import { studentService } from '../../services/student.service';
import { Loader2, User, Calendar, Heart } from 'lucide-react';

interface CreateChildProfileProps {
  parentId: string;
  onSuccess?: (studentId: string) => void;
  onCancel?: () => void;
}

const INTERESTS = [
  'Games', 'Robots', 'Art', 'Music', 'Science', 'Math',
  'Animals', 'Space', 'Sports', 'Stories', 'Building', 'Nature'
];

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual (Pictures & Diagrams)', icon: '👁️' },
  { value: 'auditory', label: 'Auditory (Sounds & Listening)', icon: '👂' },
  { value: 'kinesthetic', label: 'Hands-On (Touching & Doing)', icon: '✋' },
];

export const CreateChildProfile = ({ parentId, onSuccess, onCancel }: CreateChildProfileProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    age: '',
    date_of_birth: '',
    interests: [] as string[],
    preferred_learning_style: '',
    coppa_consent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const toggleInterest = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    handleChange('interests', newInterests);
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const available = await studentService.isUsernameAvailable(username);
    setUsernameAvailable(available);
  };

  const validateStep1 = () => {
    if (!formData.display_name || !formData.username || !formData.date_of_birth) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!usernameAvailable) {
      setError('Username is already taken');
      return false;
    }

    // Calculate age from date of birth
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 5 || age > 16) {
      setError('CodeKid is designed for children aged 5-16');
      return false;
    }

    handleChange('age', age.toString());
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.coppa_consent) {
      setError('Please accept the terms and consent');
      return;
    }

    setLoading(true);
    setError('');

    const { student, error: createError } = await studentService.createStudent({
      parent_id: parentId,
      username: formData.username,
      display_name: formData.display_name,
      age: parseInt(formData.age),
      date_of_birth: formData.date_of_birth,
      interests: formData.interests.length > 0 ? formData.interests : undefined,
      preferred_learning_style: formData.preferred_learning_style || undefined,
      coppa_consent: formData.coppa_consent,
    });

    setLoading(false);

    if (createError) {
      setError('Failed to create profile. Please try again.');
    } else if (student) {
      onSuccess?.(student.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              } ${s !== 1 ? 'ml-2' : ''}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {step} of 3
        </p>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Let's create a profile for your child! 🎉
            </h2>
            <p className="text-gray-600">We'll personalize their learning experience.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What's your child's name? *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Alex"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choose a username *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  const username = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  handleChange('username', username);
                  checkUsername(username);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="coolcoder123"
              />
              {formData.username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameAvailable === true && (
                    <span className="text-green-600">✓ Available</span>
                  )}
                  {usernameAvailable === false && (
                    <span className="text-red-600">✗ Taken</span>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Letters, numbers, and underscores only. Min 3 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For age-appropriate content (ages 5-16)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => {
              if (validateStep1()) setStep(2);
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Interests */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What are {formData.display_name}'s interests? 💫
            </h2>
            <p className="text-gray-600">We'll use this to personalize lessons (select any that apply)</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.interests.includes(interest)
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Heart
                  className={`w-5 h-5 mx-auto mb-2 ${
                    formData.interests.includes(interest) ? 'fill-current' : ''
                  }`}
                />
                <span className="text-sm font-medium">{interest}</span>
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How does {formData.display_name} learn best?
            </h3>
            <div className="space-y-2">
              {LEARNING_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleChange('preferred_learning_style', style.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                    formData.preferred_learning_style === style.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{style.icon}</span>
                  <span className="font-medium">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Consent */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Almost done! 🎊
            </h2>
            <p className="text-gray-600">Just a few important things to confirm</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Profile Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {formData.display_name}</p>
              <p><strong>Username:</strong> @{formData.username}</p>
              <p><strong>Age:</strong> {formData.age} years old</p>
              {formData.interests.length > 0 && (
                <p><strong>Interests:</strong> {formData.interests.join(', ')}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.coppa_consent}
                onChange={(e) => handleChange('coppa_consent', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that I am the parent or legal guardian of this child, and I consent to their
                use of CodeKid in accordance with COPPA regulations. I understand that I can monitor
                their activity and manage their account at any time.
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.coppa_consent}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
