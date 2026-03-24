'use client'

import LikeButton from './LikeButton'
import CommentSection from './CommentSection'
import ShareMenu from './ShareMenu'

export default function EngagementBar({ 
  likes, 
  hasLiked, 
  onLike, 
  comments, 
  commentCount, 
  showComments, 
  onToggleComments, 
  onSubmitComment,
  postUrl,
  postTitle 
}) {
  return (
    <div className="engagement-bar">
      <div className="engagement-content">
        <LikeButton likes={likes} hasLiked={hasLiked} onToggle={onLike} />
        <CommentSection 
          comments={comments}
          commentCount={commentCount}
          isOpen={showComments}
          onToggle={onToggleComments}
          onSubmit={onSubmitComment}
        />
        <ShareMenu url={postUrl} title={postTitle} />
      </div>
    </div>
  )
}