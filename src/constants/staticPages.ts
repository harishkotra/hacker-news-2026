export const STATIC_PAGES = {
  guidelines: {
    title: 'Hacker News Guidelines',
    subtitle: 'The rules of the road for the HN community.',
    content: `
      <h3>What to submit</h3>
      <p>On-topic: Anything that gratifies one's intellectual curiosity. Whether it's a technical deep dive, a philosophical essay, or a breakthrough in science, if it makes you think, it belongs here.</p>
      <p>Off-topic: Most stories about politics, or the latest celebrity gossip. If it's something you'd find on a general news site, it's probably not right for HN.</p>
      
      <h3>How to submit</h3>
      <p>Give us the original source. If a post is a blog post about a New York Times article, submit the NYT article. If it's a press release about a new product, submit the product page or a technical blog post about it.</p>
      <p>Please don't use the title to promote your story. Keep it neutral and descriptive. If the title is "The Best Way to Code," and the article is about a specific library, use the library's name.</p>
      
      <h3>In Comments</h3>
      <p>Be kind. Don't be snarky. Have curious conversations. If you disagree, do so civilly. If you find yourself getting angry, take a break.</p>
      <p>When you disagree, please reply to the argument instead of calling names. "That is idiotic; 1 + 1 is 2, not 3" can be shortened to "1 + 1 is 2, not 3."</p>
      <p>Please don't complain about the community or the moderation. If you have a concern, email us at hn@ycombinator.com.</p>
    `
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you wanted to know about HN but were afraid to ask.',
    content: `
      <h3>Are there rules about submissions?</h3>
      <p>Yes, please read the <a href="/guidelines">Guidelines</a>.</p>
      
      <h3>How are stories ranked?</h3>
      <p>The basic algorithm uses points and time. Points are divided by an exponential function of the time since submission. This means newer stories need fewer points to stay on the front page.</p>
      
      <h3>What is karma?</h3>
      <p>Karma is a measure of how much a user has contributed to the community. You get karma when people upvote your submissions or comments.</p>
      
      <h3>Why is my story not on the front page?</h3>
      <p>It might be too old, or it might not have enough points. It could also have been flagged by users or moderators if it violates the guidelines.</p>
      
      <h3>How do I reset my password?</h3>
      <p>If you have an email address associated with your account, you can use the "forgot password" link on the login page. If not, we can't help you—sorry!</p>
    `
  },
  security: {
    title: 'Security on Hacker News',
    subtitle: 'How we keep the community safe and secure.',
    content: `
      <h3>Reporting Vulnerabilities</h3>
      <p>If you find a security vulnerability on Hacker News, please let us know. You can email us at security@ycombinator.com.</p>
      <p>We appreciate responsible disclosure. Please give us a reasonable amount of time to fix the issue before making it public.</p>
      
      <h3>Our Commitment</h3>
      <p>We take security seriously. We use industry-standard practices to protect user data and ensure the integrity of the site.</p>
      <p>We do not sell user data to third parties. Your privacy is important to us.</p>
    `
  },
  lists: {
    title: 'Hacker News Lists',
    subtitle: 'Curated views of the HN universe.',
    content: `
      <ul class="space-y-4">
        <li><strong><a href="/top">Leaders</a></strong> - Users with the highest karma.</li>
        <li><strong><a href="/new">Front</a></strong> - The current front page.</li>
        <li><strong><a href="/best">Best</a></strong> - The highest-rated stories of all time.</li>
        <li><strong><a href="/ask">Ask</a></strong> - Questions from the community.</li>
        <li><strong><a href="/show">Show</a></strong> - New projects and products.</li>
        <li><strong><a href="/job">Jobs</a></strong> - Opportunities at YC startups.</li>
      </ul>
    `
  },
  legal: {
    title: 'Legal Information',
    subtitle: 'The fine print.',
    content: `
      <h3>Terms of Service</h3>
      <p>By using Hacker News, you agree to our terms of service. These terms are designed to ensure a safe and productive environment for all users.</p>
      
      <h3>Privacy Policy</h3>
      <p>We collect minimal data about our users. We use this data to improve the site and provide a better experience. We do not share your data with third parties without your consent.</p>
      
      <h3>Copyright</h3>
      <p>All content on Hacker News is the property of its respective owners. If you believe your copyright has been infringed, please contact us.</p>
    `
  }
};
