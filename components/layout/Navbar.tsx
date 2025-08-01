"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Scale,
  User,
  FileText,
  Brain,
  LogIn,
  LogOut,
  Settings,
  UserCircle,
  Video,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { session, loading, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch(`/api/profile/${session.user.id}`);
          if (response.ok) {
            const profileData = await response.json();
            setProfile(profileData);
          }
        } catch (error) {
        }
      } else {
        setProfile(null);
      }
    };

    if (!loading) {
      fetchProfile();
    }
  }, [session, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      //console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    {
      name: "AI Chatbot",
      href: "/chatbot",
      icon: <Search className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      name: "Legal Library",
      href: "/library",
      icon: <FileText className="w-4 h-4" />,
      requiresAuth: true,
    },
    {
      name: "Document Processor",
      href: "/document-processor",
      icon: <Brain className="w-4 h-4" />,
      requiresAuth: true,
    },
  ];

  if (
    profile?.role &&
    ["LAWYER", "BARRISTER", "GOVERNMENT_OFFICIAL"].includes(profile.role)
  ) {
    navItems.push({
      name: "Publish Report",
      href: "/publish-report",
      icon: <FileText className="w-4 h-4" />,
      requiresAuth: true,
    });
  }

  const filteredNavItems = navItems.filter(
    (item) => !item.requiresAuth || session
  );

  return (
    <nav className="fixed top-0 w-full border-b z-50 backdrop-blur-md bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="border p-2 rounded-none">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">Adhikaar</span>
          </Link>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-6">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${
                      pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground/50"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex cursor-pointer items-center"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>
                      {profile?.first_name || session.user.name || "Profile"}{" "}
                      {profile?.last_name || session.user.name || "Profile"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-none">
                  <DropdownMenuItem
                    className="cursor-pointer rounded-none"
                    asChild
                  >
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2 " />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 mx-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer  rounded-none"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="flex items-center space-x-1 rounded-none px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <Link href="/auth">
                    <span>Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="px-6 py-2 rounded-none text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Link href="/auth">
                    Get Started
                    <ArrowRight />
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-sky-500 hover:bg-slate-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-slate-600 hover:text-sky-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t mt-4">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 w-full text-left text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/vkyc"
                    className="flex items-center space-x-2 w-full text-left text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Update KYC</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="flex items-center space-x-2 w-full text-left text-slate-600 hover:text-sky-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth"
                    className="w-full mt-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-primary px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 text-center flex items-center justify-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
