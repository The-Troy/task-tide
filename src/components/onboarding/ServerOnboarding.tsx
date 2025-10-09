import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Users, ArrowRight } from "lucide-react";

/**
 * ServerOnboarding component guides the user through creating or joining their first server.
 * It is displayed when the user has no existing servers.
 * @param onComplete A callback function to be executed when the onboarding is completed (e.g., after creating/joining a server).
 */
export function ServerOnboarding({ onComplete }: { onComplete: () => void }) {
  // NOTE: For a real application, you would replace this with the actual CreateServerForm and JoinServerForm
  // and handle the success state within those forms to call onComplete.

  const handleSkip = () => {
    // In a real app, 'skipping' might set a preference in Firestore
    onComplete();
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="mx-auto w-fit p-3 rounded-full bg-primary/10 text-primary">
            <Server className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-gray-800">
            Welcome to the Study Space!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your first step is to join or create a Course Server. This is where you'll find your documents and study groups.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Option 1: Create Server */}
            <div className="flex flex-col p-6 border-2 border-primary/20 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <Users className="w-5 h-5 mr-2" /> Create a New Server
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Start fresh! Set up a server for a new class, invite your classmates, and organize your study materials.
              </p>
              <Button onClick={onComplete} className="w-full bg-primary hover:bg-primary/90 transition-colors">
                Create Server <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                (This will open the server creation form)
              </p>
            </div>

            {/* Option 2: Join Server */}
            <div className="flex flex-col p-6 border-2 border-green-500/20 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-2 flex items-center text-green-700">
                <Server className="w-5 h-5 mr-2" /> Join an Existing Server
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Got an invite code? Join a server already set up by your professor or a classmate.
              </p>
              <Button onClick={onComplete} variant="secondary" className="w-full border-green-500 text-green-700 hover:bg-green-200/80 transition-colors">
                Join Server <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                (This will open the server joining form)
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button variant="ghost" onClick={handleSkip} className="text-gray-500 hover:text-primary transition-colors">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}