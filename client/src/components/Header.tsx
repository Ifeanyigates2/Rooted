import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Heart, Menu } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-[var(--rooted-primary)] cursor-pointer">rooted.</h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4 mr-2" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-2" />
            </Button>
            <Link href="/account">
              <Button className="bg-[var(--rooted-primary)] text-white hover:bg-[var(--rooted-primary)]/90 rounded-full px-6">
                Account
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4 mt-8">
                  <Button variant="ghost" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Link href="/account" className="w-full">
                    <Button className="w-full bg-[var(--rooted-primary)] text-white">
                      Account
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
