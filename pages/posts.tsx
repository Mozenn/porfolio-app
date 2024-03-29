import { useState, useEffect } from 'react';
import { getPostsDataByDate, getAllTagsFromPosts } from '../lib/posts';
import styles from '../styles/posts.module.scss';
import { Post } from '../types/post';
import PostTag from '../components/posts/post-tag';
import PostCapsule from '../components/posts/post-capsule';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = getPostsDataByDate();
  const tags = getAllTagsFromPosts(posts);
  const locale = context.locale || 'en';

  return {
    props: {
      ...(await serverSideTranslations(locale, ['layout'], null, ['en', 'fr'])),
      posts,
      tags,
    },
  };
};

const Posts = ({ posts, tags }: { posts: Post[]; tags: string[] }) => {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  const onTagClicked = (tag: string) => {
    setActiveTags((prevTags: string[]) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  useEffect(() => {
    if (activeTags.length === 0) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter((post) => {
          return post.tags.some((tag) => activeTags.includes(tag));
        }),
      );
    }
  }, [activeTags, posts]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.tagContainer}>
          {tags.map((tag) => {
            return <PostTag key={tag} label={tag} onClick={onTagClicked} />;
          })}
        </div>
        <div className={styles.postContainer}>
          {filteredPosts.map((post) => {
            return <PostCapsule key={post.id} postData={post} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Posts;
