
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: July 26, 2024</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>
                    Welcome to CareerCompass AI. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
                 <p>
                    We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of this Privacy Policy.
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Collection of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
               <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, and other personal details you voluntarily give to us when you register with the Application or when you choose to participate in various activities related to the Application.
                    </li>
                    <li>
                       <strong>Profile Data:</strong> To provide our AI-powered services, we collect detailed professional and educational data, including your skills, projects, work experience, educational qualifications, and career aspirations.
                    </li>
                    <li>
                        <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
                    </li>
                </ul>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Use of Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Create and manage your account.</li>
                    <li>Generate personalized AI career assessments, skill-gap analyses, and resume optimizations.</li>
                    <li>Email you regarding your account or order.</li>
                    <li>Increase the efficiency and operation of the Application.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                </ul>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>If you have questions or comments about this Privacy Policy, please contact us at: subhasishnayak12345.com</p>
            </CardContent>
        </Card>

    </div>
  );
}
