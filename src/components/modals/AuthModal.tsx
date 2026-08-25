import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  ShieldCheck,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  MapPin,
  Globe,
  Building2,
  CheckCircle2,
  Info,
  Sliders,
  Award,
  Clock,
} from 'lucide-react';
import { MOCK_CURRENT_USER, MOCK_COLLEGES, PIN_DIRECTORY } from '../../data/mockData';
import { RoleType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    setCurrentUser,
    showToast,
    triggerNetworkPulse,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 - Identity
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('Full Stack Engineer');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year (Junior)');

  // Step 2 - Location & College
  const [collegeSearch, setCollegeSearch] = useState('SRM Institute of Science and Technology');
  const [selectedCollegeShort, setSelectedCollegeShort] = useState('SRM IST');
  const [pinCode, setPinCode] = useState('603203');
  const [city, setCity] = useState('Kattankulathur');
  const [country, setCountry] = useState('India');
  const [countryCode, setCountryCode] = useState('IN');
  const [countryFlag, setCountryFlag] = useState('🇮🇳');

  // Preferences
  const [scopeSameCollege, setScopeSameCollege] = useState(true);
  const [scopeNearby, setScopeNearby] = useState(true);
  const [nearbyRadius, setNearbyRadius] = useState<5 | 25 | 50>(25);
  const [scopeCountry, setScopeCountry] = useState(true);
  const [scopeGlobal, setScopeGlobal] = useState(true);
  const [preferLocalOffline, setPreferLocalOffline] = useState(true);
  const [openGlobalOnline, setOpenGlobalOnline] = useState(true);

  // Autocomplete dropdown state
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);

  if (!authModalOpen) return null;

  const handlePinCodeChange = (code: string) => {
    setPinCode(code);
    const lookup = PIN_DIRECTORY[code.trim()];
    if (lookup) {
      setCollegeSearch(lookup.college);
      setSelectedCollegeShort(lookup.collegeShort);
      setCity(lookup.city);
      setCountry(lookup.country);
      setCountryCode(lookup.countryCode);
      setCountryFlag(lookup.flag);
    }
  };

  const handleSelectCollege = (col: typeof MOCK_COLLEGES[0]) => {
    setCollegeSearch(col.name);
    setSelectedCollegeShort(col.shortName);
    setPinCode(col.pinCode);
    setCity(col.city);
    setCountry(col.country);
    setCountryCode(col.countryCode);
    setCountryFlag(col.flag);
    setShowCollegeSuggestions(false);
  };

  const handleCompleteOnboarding = () => {
    const scopes: ('same_college' | 'nearby_colleges' | 'country' | 'global')[] = [];
    if (scopeSameCollege) scopes.push('same_college');
    if (scopeNearby) scopes.push('nearby_colleges');
    if (scopeCountry) scopes.push('country');
    if (scopeGlobal) scopes.push('global');

    const newUser = {
      ...MOCK_CURRENT_USER,
      fullName: fullName || 'Arjun Mehta',
      email: email || 'student@srmist.edu.in',
      college: collegeSearch || 'SRM Institute of Science and Technology',
      collegeShort: selectedCollegeShort || 'SRM IST',
      pinCode: pinCode || '603203',
      city: city || 'Kattankulathur',
      location: `${city || 'Kattankulathur'}, ${country}`,
      country,
      countryCode,
      countryFlag,
      yearOfStudy,
      preferredRoles: [selectedRole, 'Frontend Engineer'],
      locationPreference: {
        scopes,
        preferLocalOffline,
        openGlobalOnline,
        nearbyRadiusKm: nearbyRadius,
        visibility: 'city_college' as const,
      },
    };

    setCurrentUser(newUser);
    triggerNetworkPulse(2.5);
    showToast('Campus verified! Your location-aware teammate network is live 🚀', 'success');
    setAuthModalOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(MOCK_CURRENT_USER);
    showToast(`Welcome back, ${MOCK_CURRENT_USER.fullName}! 👋`, 'success');
    triggerNetworkPulse(2);
    setAuthModalOpen(false);
  };

  const filteredColleges = MOCK_COLLEGES.filter(
    (c) =>
      c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
      c.shortName.toLowerCase().includes(collegeSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => setAuthModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 text-slate-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            {authMode === 'login' ? 'Sign In to TeamForge' : 'Join TeamForge AI'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {authMode === 'login'
              ? 'Enter your credentials to access campus and global squads'
              : 'Find the right teammates from your college, nearby campuses, or anywhere in the world'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setStep(1);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode !== 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create Account & Onboard
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* LOGIN MODE */}
        {authMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Student Email (.edu or university email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  defaultValue="arjun.mehta@srmist.edu.in"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer"
              >
                <span>Sign In to Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>One-click student demo profile ready (SRM IST, Tamil Nadu).</span>
            </div>
          </form>
        ) : (
          /* MULTI-STEP ONBOARDING */
          <div className="space-y-4 text-xs">
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  1
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Identity</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  2
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Campus & Location</span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  3
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Preferences</span>
              </div>
            </div>

            {/* STEP 1: Basic Identity */}
            {step === 1 && (
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Arjun Mehta"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="yourname@srmist.edu.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Primary Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                    >
                      <option value="Full Stack Engineer">Full Stack Engineer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="AI / ML Engineer">AI / ML Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="DevOps / Cloud">DevOps / Cloud</option>
                      <option value="Smart Contract / Web3">Smart Contract / Web3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Year of Study
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                    >
                      <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                      <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                      <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                      <option value="4th Year (Senior)">4th Year (Senior)</option>
                      <option value="Masters / Postgrad">Masters / Postgrad</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Next: Add College & Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: College & Location */}
            {step === 2 && (
              <div className="space-y-3.5 pt-2">
                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                    Your location helps us find teammates from your college and nearby colleges. We never display your exact address or GPS coordinates.
                  </p>
                </div>

                {/* College Search & Autocomplete */}
                <div className="relative">
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Where do you study? (College / University)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search college (e.g. SRM IST, VIT, Stanford...)"
                      value={collegeSearch}
                      onChange={(e) => {
                        setCollegeSearch(e.target.value);
                        setShowCollegeSuggestions(true);
                      }}
                      onFocus={() => setShowCollegeSuggestions(true)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  {showCollegeSuggestions && filteredColleges.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 space-y-1">
                      {filteredColleges.slice(0, 5).map((col) => (
                        <div
                          key={col.id}
                          onClick={() => handleSelectCollege(col)}
                          className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/60 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{col.name}</span>
                              <span className="text-[10px] text-blue-600 font-extrabold">({col.shortName})</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {col.city}, {col.country} • PIN: {col.pinCode}
                            </div>
                          </div>
                          <span className="text-base">{col.flag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PIN Code & City Autodetect */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      PIN Code (Autofills City)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. 603203"
                        value={pinCode}
                        onChange={(e) => handlePinCodeChange(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kattankulathur / Chennai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (e.target.value === 'India') {
                          setCountryCode('IN');
                          setCountryFlag('🇮🇳');
                        } else if (e.target.value === 'United States') {
                          setCountryCode('US');
                          setCountryFlag('🇺🇸');
                        } else if (e.target.value === 'Spain') {
                          setCountryCode('ES');
                          setCountryFlag('🇪🇸');
                        } else if (e.target.value === 'South Korea') {
                          setCountryCode('KR');
                          setCountryFlag('🇰🇷');
                        }
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Spain">🇪🇸 Spain</option>
                      <option value="South Korea">🇰🇷 South Korea</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Next: Matching Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Team Location Preferences */}
            {step === 3 && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Where do you want to find teammates?
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Same College */}
                    <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scopeSameCollege}
                        onChange={(e) => setScopeSameCollege(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>🏫 Same College</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Students from {selectedCollegeShort}</p>
                      </div>
                    </label>

                    {/* Nearby Colleges */}
                    <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scopeNearby}
                        onChange={(e) => setScopeNearby(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>📍 Nearby Colleges</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Campuses near {city}</p>
                      </div>
                    </label>

                    {/* Country */}
                    <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scopeCountry}
                        onChange={(e) => setScopeCountry(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{countryFlag} In {country}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Nationwide student builders</p>
                      </div>
                    </label>

                    {/* Global */}
                    <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scopeGlobal}
                        onChange={(e) => setScopeGlobal(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>🌎 Global Builders</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Anywhere in the world</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Nearby Radius Selector */}
                {scopeNearby && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Nearby College Radius</span>
                      <span className="font-extrabold text-blue-600">{nearbyRadius} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {([5, 25, 50] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNearbyRadius(r)}
                          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                            nearbyRadius === r
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hackathon Event Format Preferences */}
                <div className="space-y-2">
                  <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Competition Formats:
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={preferLocalOffline}
                        onChange={(e) => setPreferLocalOffline(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Prefer local teammates for in-person / offline hackathons</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={openGlobalOnline}
                        onChange={(e) => setOpenGlobalOnline(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Open to international builders for online & Sunday sprints</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteOnboarding}
                    className="flex-1 py-3 rounded-2xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch My Teammate Network</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
