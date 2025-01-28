'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const dynamic = "force-dynamic";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = {
      recipientName: e.target.recipientName.value,
      emailPurpose: e.target.emailPurpose.value,
      keyPoints: e.target.keyPoints.value,
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedEmail(data.email);
      toast({
        title: 'Success',
        description: 'Email template generated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            Professional Email Generator
          </h1>
          <p className="text-muted-foreground">
            Generate professional email templates in seconds
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailPurpose">Email Purpose</Label>
              <Select name="emailPurpose" required defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting-request">Meeting Request</SelectItem>
                  <SelectItem value="follow-up">Follow Up</SelectItem>
                  <SelectItem value="thank-you">Thank You</SelectItem>
                  <SelectItem value="introduction">Introduction</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points to Include</Label>
              <Textarea
                id="keyPoints"
                name="keyPoints"
                placeholder="Enter the main points you want to include in the email..."
                required
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate Email
                </>
              )}
            </Button>
          </form>
        </Card>

        {generatedEmail && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Email</h2>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {generatedEmail}
            </div>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => {
                navigator.clipboard.writeText(generatedEmail);
                toast({
                  description: 'Email copied to clipboard!',
                });
              }}
            >
              Copy to Clipboard
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}