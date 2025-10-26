'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Review {
  id: string
  user_id: string
  user_name: string
  user_avatar: string
  item_id: string
  rating: number
  title: string
  comment: string
  helpful_count: number
  created_at: string
  updated_at: string
  is_verified_purchase: boolean
  is_author_response: boolean
  author_response?: string
  author_response_date?: string
}

interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  verified_purchases: number
}

interface ReviewSystemProps {
  itemId: string
  itemName: string
  canReview: boolean
  hasPurchased: boolean
  onReviewSubmit: (rating: number, title: string, comment: string) => Promise<void>
  onReviewUpdate: (reviewId: string, rating: number, title: string, comment: string) => Promise<void>
  onReviewDelete: (reviewId: string) => Promise<void>
  onHelpfulVote: (reviewId: string) => Promise<void>
  onReportReview: (reviewId: string, reason: string) => Promise<void>
}

export function ReviewSystem({
  itemId,
  itemName,
  canReview,
  hasPurchased,
  onReviewSubmit,
  onReviewUpdate,
  onReviewDelete,
  onHelpfulVote,
  onReportReview
}: ReviewSystemProps) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    verified_purchases: 0
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')

  useEffect(() => {
    loadReviews()
  }, [itemId])

  const loadReviews = async () => {
    setLoading(true)
    try {
      // Mock data - in real implementation, this would fetch from API
      const mockReviews: Review[] = [
        {
          id: '1',
          user_id: 'user1',
          user_name: 'John Designer',
          user_avatar: '/api/placeholder/40/40',
          item_id: itemId,
          rating: 5,
          title: 'Excellent theme!',
          comment: 'This theme is exactly what I was looking for. Clean design, easy to customize, and works perfectly with GoHighLevel.',
          helpful_count: 12,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          is_verified_purchase: true,
          is_author_response: false
        },
        {
          id: '2',
          user_id: 'user2',
          user_name: 'Sarah Agency',
          user_avatar: '/api/placeholder/40/40',
          item_id: itemId,
          rating: 4,
          title: 'Great overall, minor issues',
          comment: 'Really like the design and functionality. Had some minor CSS issues but the author was quick to help resolve them.',
          helpful_count: 8,
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-14T14:20:00Z',
          is_verified_purchase: true,
          is_author_response: false,
          author_response: 'Thanks for the feedback! I\'ve fixed those CSS issues in the latest update.',
          author_response_date: '2024-01-14T16:30:00Z'
        },
        {
          id: '3',
          user_id: 'user3',
          user_name: 'Mike Developer',
          user_avatar: '/api/placeholder/40/40',
          item_id: itemId,
          rating: 5,
          title: 'Perfect for my needs',
          comment: 'Exactly what I needed for my client project. The documentation was clear and the theme was easy to implement.',
          helpful_count: 15,
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T09:15:00Z',
          is_verified_purchase: true,
          is_author_response: false
        },
        {
          id: '4',
          user_id: 'user4',
          user_name: 'Anonymous User',
          user_avatar: '/api/placeholder/40/40',
          item_id: itemId,
          rating: 2,
          title: 'Not as described',
          comment: 'The theme doesn\'t look like the preview images. The colors are different and some elements are missing.',
          helpful_count: 3,
          created_at: '2024-01-12T16:45:00Z',
          updated_at: '2024-01-12T16:45:00Z',
          is_verified_purchase: false,
          is_author_response: false
        }
      ]

      const mockStats: ReviewStats = {
        average_rating: 4.0,
        total_reviews: 4,
        rating_distribution: { 5: 2, 4: 1, 3: 0, 2: 1, 1: 0 },
        verified_purchases: 3
      }

      setReviews(mockReviews)
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast({
        title: "Review Required",
        description: "Please fill in both title and comment",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onReviewSubmit(newReview.rating, newReview.title, newReview.comment)
      setNewReview({ rating: 0, title: '', comment: '' })
      setShowReviewForm(false)
      await loadReviews()
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReview = async (reviewId: string) => {
    setLoading(true)
    try {
      await onReviewUpdate(reviewId, newReview.rating, newReview.title, newReview.comment)
      setEditingReview(null)
      setNewReview({ rating: 0, title: '', comment: '' })
      await loadReviews()
      toast({
        title: "Review Updated",
        description: "Your review has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await onReviewDelete(reviewId)
      await loadReviews()
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      await onHelpfulVote(reviewId)
      await loadReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to vote on review",
        variant: "destructive",
      })
    }
  }

  const handleReportReview = async (reviewId: string) => {
    const reason = prompt('Please provide a reason for reporting this review:')
    if (reason) {
      try {
        await onReportReview(reviewId, reason)
        toast({
          title: "Review Reported",
          description: "Thank you for reporting. We'll review this content.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to report review",
          variant: "destructive",
        })
      }
    }
  }

  const startEditing = (review: Review) => {
    setEditingReview(review.id)
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    })
  }

  const cancelEditing = () => {
    setEditingReview(null)
    setNewReview({ rating: 0, title: '', comment: '' })
  }

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            } transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful_count - a.helpful_count
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Customer Reviews
          </CardTitle>
          <CardDescription>
            {stats.total_reviews} reviews for {itemName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">
                {stats.average_rating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.average_rating))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {stats.total_reviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.rating_distribution[rating as keyof typeof stats.rating_distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {canReview && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Write a Review
            </CardTitle>
            <CardDescription>
              {hasPurchased ? 'Share your experience with this item' : 'You need to purchase this item to write a review'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasPurchased ? (
              <div className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience..."
                    className="glass mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="review-comment">Your Review</Label>
                  <Textarea
                    id="review-comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Tell others about your experience with this item..."
                    className="glass mt-2"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                    className="glass"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  You need to purchase this item to write a review
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 glass rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border-b border-white/10 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm text-white font-bold">
                        {review.user_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.user_name}</span>
                        {review.is_verified_purchase && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {renderStars(review.rating)}
                        <span>•</span>
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="glass">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
                
                {review.author_response && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-blue-400">Author Response</span>
                      <span className="text-xs text-muted-foreground">
                        {review.author_response_date && new Date(review.author_response_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.author_response}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleHelpfulVote(review.id)}
                      className="glass"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count})
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReportReview(review.id)}
                      className="glass"
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                  
                  {/* Edit/Delete buttons for user's own reviews */}
                  {review.user_id === 'current-user' && (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(review)}
                        className="glass"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReview(review.id)}
                        className="glass"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

