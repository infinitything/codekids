import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubscribing(true);
    try {
      // Store newsletter subscription in database
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: newsletterEmail })
        .select();

      if (error) {
        // If duplicate, show friendly message
        if (error.code === '23505') {
          toast.success('You\'re already subscribed! 🎉');
        } else {
          throw error;
        }
      } else {
        toast.success('✅ Subscribed! Check your email for a welcome message.');
      }
      setNewsletterEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      toast.error('Oops! Please try again later.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerLinks: Record<string, Array<{ label: string; href: string }>> = {
    'Program': [
      { label: 'Curriculum', href: '#curriculum' },
      { label: 'Age Groups', href: '#curriculum' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Success Stories', href: '#results' },
      { label: 'Certificates', href: '/badges' }
    ],
    'Platform': [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Courses', href: '/courses' },
      { label: 'Support', href: '/#faq' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Guarantees', href: '#pricing' }
    ],
    'Company': [
      { label: 'About Us', href: '/' },
      { label: 'Our Team', href: '/' },
      { label: 'Careers', href: '/' },
      { label: 'Press', href: '/' },
      { label: 'Contact', href: '/#faq' },
      { label: 'Admin Panel', href: '/admin' }
    ],
    'Resources': [
      { label: 'Blog', href: '/' },
      { label: 'Coding Tips', href: '/#faq' },
      { label: 'Parent Guides', href: '/#faq' },
      { label: 'Student Projects', href: '/courses' },
      { label: 'Community', href: '/' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-bold text-blue-400 mb-4">
              &lt;CodeKid&gt;
            </div>
            <p className="text-gray-300 text-lg mb-6">
              Transforming curious minds into confident coders. 
              Building the next generation of tech innovators.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={20} className="text-blue-400" />
                <span>support@codekid.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone size={20} className="text-blue-400" />
                <span>1-800-CODE-KID</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={20} className="text-blue-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white text-lg mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">
                Get Free Coding Tips for Your Child
              </h4>
              <p className="text-gray-300">
                Weekly emails with fun projects, learning tips, and success stories.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-gray-400">
              <span>&copy; 2024 CodeKid. All rights reserved.</span>
              <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Follow us:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="text-gray-400 group-hover:text-white" size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;