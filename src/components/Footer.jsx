import { Heart, Coffee, Mail, Github } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center mb-4 text-2xl font-bold">
              <span className="text-rose-600 dark:text-rose-400 text-3xl">404</span>
              <span className="text-teal-600 dark:text-teal-400">.js</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A modern platform for sharing your thoughts, ideas, inspirations, and photos with the world.
            </p>
            <p className="text-gray-600 dark:text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-1 text-rose-500" /> and{" "}
              <Coffee size={16} className="mx-1 text-amber-700" />
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/new"
                  className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Create Post
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 404.js Blog Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
