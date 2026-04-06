'use client';

import { useState } from 'react';
import { Input, Button, Notification, IconBar } from '@lancebailey26/skyforge-ui';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const contactTags = ['Collaboration', 'Roles & opportunities', 'Quick hello'];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      setNotificationMessage("Thank you for your message! I'll get back to you soon.");
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
    <section
      id="contact"
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient tech-marquee-section"
      data-ambient="4"
      aria-labelledby="contact-heading"
    >
      {showNotification && (
        <Notification
          title={notificationMessage.includes('Thank you') ? 'Success' : 'Error'}
          description={notificationMessage}
          type={notificationMessage.includes('Thank you') ? 'success' : 'error'}
          timeout={5000}
          placement="top-right"
        />
      )}

      <div className="portfolio-contact-shell">
        <div className="portfolio-contact-header">
          <header className="tech-marquee-header">
            <p className="tech-marquee-eyebrow">Reach out</p>
            <h2 id="contact-heading" className="tech-marquee-title">
              Contact
            </h2>
            <p className="tech-marquee-subtitle">
              Questions, collaboration, or just saying hello?
            </p>
            <p className="tech-marquee-subtitle">
              Drop a note and I&apos;ll reply when I can.
            </p>
          </header>

          <ul className="tech-marquee-tags portfolio-contact-tags" aria-label="Contact themes">
            {contactTags.map((label) => (
              <li key={label}>
                <span className="tech-marquee-tag">{label}</span>
              </li>
            ))}
          </ul>

          <div className="portfolio-contact-social">
            <IconBar
              size="large"
              icons={[
                {
                  icon: faGithub,
                  href: 'https://github.com/lancebailey26',
                  ariaLabel: 'GitHub profile',
                },
                {
                  icon: faLinkedin,
                  href: 'https://linkedin.com/in/lance-bailey',
                  ariaLabel: 'LinkedIn profile',
                }
              ]}
            />
            <Button
              text="View Resume"
              size="small"
              color="secondary"
              subColor="clear"
              className="portfolio-contact-resume-button"
              onClick={() => {
                const el = document.createElement('a');
                el.href = '/resume.pdf';
                el.target = '_blank';
                el.rel = 'noopener noreferrer';
                el.click();
              }}
              attributes={{
                type: 'button',
                'aria-label': 'View résumé, opens PDF in a new tab',
              }}
            />
          </div>
        </div>

        <div className="portfolio-contact-form-wrap">
          <div className="tech-marquee-stage portfolio-contact-stage">
            <p className="tech-marquee-stage-kicker">Send a message</p>
            <form className="portfolio-contact-form" onSubmit={handleSubmit}>
              <Input label="Name" name="name" type="text" value={formData.name} onChange={handleInputChange('name')} style="fill" />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="your.email@example.com"
                style="fill"
              />

              <div>
                <label htmlFor="contact-message" className="portfolio-contact-textarea-label">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message')(e.target.value)}
                  placeholder="Your message"
                  className="portfolio-contact-textarea"
                  rows={6}
                />
              </div>

              <Button
                text={isSubmitting ? 'Sending...' : 'Send Message'}
                size="large"
                color="primary"
                disabled={isSubmitting}
                className="portfolio-contact-submit"
                attributes={{ type: 'submit' }}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}