'use client';
import { useState } from 'react';
import { Container, Input, Button, Notification } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { IconBar } from '@skyforge/ui';

export default function ContactPage() {
  useTitle('Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(!formData.name || !formData.email || !formData.message) {
      setNotificationMessage('Please fill in all fields.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email)) {
      setNotificationMessage('Please enter a valid email address.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setNotificationMessage('Thank you for your message! I\'ll get back to you soon.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      
      setFormData({ name: '', email: '', message: '' });
    } catch(error) {
      console.error('Error submitting form:', error);
      setNotificationMessage('Failed to send message. Please try again later.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {showNotification && (
        <Notification
          title={notificationMessage.includes('Thank you') ? 'Success' : 'Error'}
          description={notificationMessage}
          type={notificationMessage.includes('Thank you') ? 'success' : 'error'}
          timeout={5000}
          placement="top-right"
        />
      )}
      
      <Container size="large" padding="lg" glass={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Contact
            </h1>
            <IconBar 
              size="large"
              icons={[
                {
                  icon: faGithub,
                  href: 'https://github.com/lancebailey26',
                  ariaLabel: 'GitHub profile'
                },
                {
                  icon: faLinkedin,
                  href: 'https://linkedin.com/in/lance-bailey',
                  ariaLabel: 'LinkedIn profile'
                }
              ]}
            />
          </div>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <Input
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Your name"
              style="fill"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="your.email@example.com"
              style="fill"
            />

            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                marginBottom: '0.5rem',
                color: 'var(--color-on-surface)'
              }}>
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message')(e.target.value)}
                placeholder="Your message"
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  backgroundColor: 'var(--color-container-high)',
                  color: 'var(--color-on-surface)',
                  border: '1px solid var(--color-outline)',
                  borderRadius: '8px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <Button
              text={isSubmitting ? 'Sending...' : 'Send Message'}
              size="large"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              attributes={{ type: 'submit' }}
            />
          </form>
        </div>
      </Container>
    </div>
  );
}