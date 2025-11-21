import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@everythinguganda.com',
    description: 'Send us an email and we\'ll respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+256 700 123 456',
    description: 'Available Monday to Friday, 8 AM - 6 PM EAT',
  },
  {
    icon: MapPin,
    title: 'Visit Our Office',
    details: 'Kampala, Uganda',
    description: 'Plot 123, Tourism Street, Central Business District',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon - Fri: 8 AM - 6 PM',
    description: 'Saturday: 9 AM - 3 PM, Sunday: Closed',
  },
];

export const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    reset();
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80"
            alt="Contact us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 font-heading tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to plan your Uganda adventure? We're here to help you create 
            the perfect experience tailored to your interests and dreams.
          </motion.p>
        </div>
      </section>

      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="px-8">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">Let us Start Planning</h2>
                <p className="text-lg text-gray-600 mb-8 font-body">
                  Whether you are interested in gorilla trekking, cultural experiences, or luxury safaris, 
                  our team of Uganda experts is ready to help you plan the perfect adventure.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactInfo.map((item) => (
                    <div
                      key={item.title}
                      className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <item.icon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-emerald-800 text-sm mb-2 font-heading">{item.title}</h4>
                          <p className="text-xs text-gray-700 leading-relaxed mb-1 font-body">{item.details}</p>
                          <p className="text-xs text-gray-700 leading-relaxed font-body">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Booking */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-green-50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">Ready to Book?</h3>
                    <p className="text-gray-600 mb-6 font-body">
                      Skip the waiting and start your booking process right away. Our team will 
                      contact you within 2 hours to finalize the details.
                    </p>
                    <Button
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">Message Sent!</h3>
                        <p className="text-gray-600 font-body">
                          Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-body">Full Name *</Label>
                            <Input
                              id="name"
                              {...register('name')}
                              placeholder="John Doe"
                              className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="font-body">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              {...register('email')}
                              placeholder="john@example.com"
                              className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                              <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject" className="font-body">Subject *</Label>
                          <Input
                            id="subject"
                            {...register('subject')}
                            placeholder="Inquiry about Uganda safari packages"
                            className={errors.subject ? 'border-red-500' : ''}
                          />
                          {errors.subject && (
                            <p className="text-sm text-red-600">{errors.subject.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="font-body">Message *</Label>
                          <Textarea
                            id="message"
                            {...register('message')}
                            rows={6}
                            placeholder="Tell us about your travel plans, interests, dates, group size, budget, and any specific questions you have..."
                            className={errors.message ? 'border-red-500' : ''}
                          />
                          {errors.message && (
                            <p className="text-sm text-red-600" role="alert">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" size="lg">
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>

                        <p className="text-sm text-gray-500 text-center font-body">
                          We typically respond within 24 hours during business days
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 font-body">Quick answers to common questions</p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "How far in advance should I book my Uganda trip?",
                a: "We recommend booking 3-6 months in advance, especially for gorilla trekking permits which are limited. Peak seasons (June-September, December-February) require earlier booking."
              },
              {
                q: "What's included in your package prices?",
                a: "Package inclusions vary by tier. All packages include guided tours and transportation during tours. Gold and Platinum packages include accommodation, meals, and additional services. See our detailed comparison on the packages page."
              },
              {
                q: "Do you help with visa applications?",
                a: "Yes! Our Platinum package includes visa assistance, and we provide guidance for all travelers. We also offer step-by-step visa information on our Visa & Flights page."
              },
              {
                q: "Can you accommodate dietary restrictions and accessibility needs?",
                a: "Absolutely. We work with all our partners to accommodate dietary restrictions, mobility needs, and other special requirements. Please inform us during booking so we can make proper arrangements."
              },
              {
                q: "What happens if I need to cancel my trip?",
                a: "Cancellation policies vary by package and timing. We offer flexible policies with full refunds for cancellations made well in advance. Travel insurance is recommended and included in our Platinum package."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-emerald-800 text-sm mb-2 font-heading">{faq.q}</h4>
                <p className="text-xs text-gray-700 leading-relaxed font-body">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
