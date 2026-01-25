export default function Footer() {
  return (
    <footer className="px-6 md:px-16 py-12 border-t border-border mt-12 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left: Availability */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">Available for work</h3>
          <p className="text-gray-500 text-sm">Open to freelance and contract roles.</p>
        </div>

        {/* Right: Links */}
        <div className="flex gap-8 text-sm font-medium">
          <a href="mailto:hello@example.com" className="hover:text-accent transition-colors">
            Email ↗
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            LinkedIn ↗
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            Twitter ↗
          </a>
        </div>
        
      </div>
      
      {/* Bottom Copyright */}
      <div className="mt-16 text-xs text-gray-300 flex justify-between items-end">
        <span>© 2024 Portfolio</span>
        <span>Local Time: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </footer>
  );
}