import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Blog.css';

const categories = ['All', 'Electrical', 'Plumbing', 'Home Tips', 'Cleaning', 'For Providers'];

const featuredPost = {
  id: 'featured-1',
  image: '/blogimages/blogfeature.jpg',
  category: 'Home Tips',
  title: '10 things every homeowner should check before the rainy season',
  excerpt:
    'From gutter cleaning to checking your roof for leaks, here is a simple seasonal checklist to keep your home safe and dry before the rains arrive.',
  author: 'Workly Team',
  date: 'June 10, 2026',
  readTime: '6 min read',
};

const posts = [
  {
    id: 'post-1',
    image: '/blogimages/blog-1.jpg',
    category: 'Electrical',
    title: 'How to spot warning signs of faulty wiring at home',
    excerpt: 'Flickering lights and warm outlets can mean more than just bad luck. Here is what to look for.',
    author: 'Nadeesha P.',
    date: 'June 8, 2026',
    readTime: '4 min read',
  },
  {
    id: 'post-2',
    image: '/blogimages/blog-2.jpg',
    category: 'Plumbing',
    title: 'Quick fixes for a leaking tap before the plumber arrives',
    excerpt: 'A few simple steps can stop a small leak from turning into a big water bill.',
    author: 'Ruwan S.',
    date: 'June 5, 2026',
    readTime: '3 min read',
  },
  {
    id: 'post-3',
    image: '/blogimages/blog-3.jpg',
    category: 'Cleaning',
    title: 'Deep cleaning checklist for a spotless kitchen',
    excerpt: 'Room-by-room guidance on what to clean, how often, and which products actually work.',
    author: 'Workly Team',
    date: 'June 2, 2026',
    readTime: '5 min read',
  },
  {
    id: 'post-4',
    image: '/blogimages/blog-4.jpg',
    category: 'For Providers',
    title: 'How to build a 5-star reputation as a new service provider',
    excerpt: 'Practical tips from top-rated Workly professionals on winning repeat customers.',
    author: 'Dilani F.',
    date: 'May 29, 2026',
    readTime: '7 min read',
  },
  {
    id: 'post-5',
    image: '/blogimages/blog-5.jpg',
    category: 'Home Tips',
    title: 'Setting up your home for the AC season: a quick guide',
    excerpt: 'Maintenance steps that extend the life of your AC unit and lower your electricity bill.',
    author: 'Workly Team',
    date: 'May 26, 2026',
    readTime: '4 min read',
  },
  {
    id: 'post-6',
    image: '/blogimages/blog-6.jpg',
    category: 'Electrical',
    title: 'DIY or call a pro? A guide to home electrical safety',
    excerpt: 'Knowing where to draw the line between a simple fix and a job for a licensed electrician.',
    author: 'Ruwan S.',
    date: 'May 22, 2026',
    readTime: '5 min read',
  },
];

const popularPosts = posts.slice(0, 3);
const tags = ['Electrical', 'Plumbing', 'Cleaning', 'AC repair', 'Painting', 'Carpentry', 'Safety', 'Maintenance'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog">
      <Navbar />

      {/* Hero */}
      <section className="blog-hero">
        <span className="blog-hero-eyebrow">
          <i className="ti ti-news" aria-hidden="true"></i>
          Workly Blog
        </span>
        <h1>
          Tips, guides & stories from the <span>Workly</span> community
        </h1>
        <p>
          Practical advice for homeowners and service professionals — from
          quick fixes to growing your business on Workly.
        </p>
        <form
          className="blog-search"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
          }}
        >
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Categories */}
      <div className="blog-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured post */}
      <section className="blog-featured">
        <Link to={`/blog/${featuredPost.id}`} className="featured-card">
          <div
            className="featured-image"
            style={{ backgroundImage: `url(${featuredPost.image})` }}
          >
            <span className="featured-tag">{featuredPost.category}</span>
          </div>
          <div className="featured-content">
            <div className="featured-meta">
              <span><i className="ti ti-user" aria-hidden="true"></i>{featuredPost.author}</span>
              <span><i className="ti ti-calendar" aria-hidden="true"></i>{featuredPost.date}</span>
              <span><i className="ti ti-clock" aria-hidden="true"></i>{featuredPost.readTime}</span>
            </div>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <span className="featured-readmore">
              Read article <i className="ti ti-arrow-right" aria-hidden="true"></i>
            </span>
          </div>
        </Link>
      </section>

      {/* Grid + sidebar */}
      <section className="blog-grid-section">
        <div className="blog-grid">
          {filteredPosts.length === 0 && (
            <p style={{ color: '#8a8a8a', fontSize: '14px' }}>
              No articles match your search.
            </p>
          )}

          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} className="post-card" key={post.id}>
              <div
                className="post-image"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <span className="post-category">{post.category}</span>
              </div>
              <div className="post-body">
                <div className="post-meta">
                  <span><i className="ti ti-calendar" aria-hidden="true"></i>{post.date}</span>
                  <span><i className="ti ti-clock" aria-hidden="true"></i>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="post-readmore">
                  Read more <i className="ti ti-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </Link>
          ))}

          {filteredPosts.length > 0 && (
            <div className="blog-pagination">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button type="button" className="page-btn" onClick={() => setPage((p) => p + 1)}>
                <i className="ti ti-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          <div className="sidebar-card">
            <h4>Popular posts</h4>
            <div className="sidebar-popular">
              {popularPosts.map((post) => (
                <Link to={`/blog/${post.id}`} className="popular-item" key={post.id}>
                  <div
                    className="popular-thumb"
                    style={{ backgroundImage: `url(${post.image})` }}
                  ></div>
                  <div className="popular-info">
                    <h5>{post.title}</h5>
                    <span>{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h4>Browse by tag</h4>
            <div className="sidebar-tags">
              {tags.map((tag) => (
                <a href="#" className="sidebar-tag" key={tag}>
                  {tag}
                </a>
              ))}
            </div>
          </div>

          <div className="sidebar-card sidebar-newsletter">
            <i className="ti ti-mail-opened" aria-hidden="true"></i>
            <h4>Get updates in your inbox</h4>
            <p>Subscribe for the latest tips, guides and Workly news.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@example.com" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
}
