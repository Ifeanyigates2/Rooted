import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Link } from "wouter";

interface AccountModalProps {
  children: React.ReactNode;
}

export default function AccountModal({ children }: AccountModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-100 border-0 rounded-3xl p-8">
        <VisuallyHidden>
          <DialogTitle>Account Options</DialogTitle>
          <DialogDescription>Choose how you'd like to access your account</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col space-y-4">
          <Link href="/signup">
            <Button className="w-full bg-[var(--rooted-primary)] text-white py-4 rounded-full font-semibold hover:bg-[var(--rooted-primary)]/90 transition-colors">
              Sign up ✨
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="ghost" className="w-full py-4 text-[var(--rooted-primary)] hover:bg-white/50 font-medium">
              Log in
            </Button>
          </Link>
          
          <div className="border-t border-gray-300 pt-4">
            <Link href="/become-provider">
              <Button variant="ghost" className="w-full py-4 text-[var(--rooted-primary)] hover:bg-white/50 font-medium">
                Become a provider →
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}