import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostHeader from '@/components/BlogPostHeader';
import BlogPostContent from '@/components/BlogPostContent';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  // Return empty array to use dynamic routing instead of static generation
  return [];
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  return {
    title: 'ICE SUPER Blog',
    description: 'Casino Tech, Affiliate Growth & the Future of iGaming',
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    // Import the blog storage function directly to avoid fetch issues
    const { getBlogPostBySlug } = await import('@/lib/blog-storage');
    const post = await getBlogPostBySlug(params.slug);

    if (!post || !post.published) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-ice-black">
        <Navbar />
        <main>
        <BlogPostHeader post={post} />
        <BlogPostContent post={post} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
