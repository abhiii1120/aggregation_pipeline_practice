import { User } from "../models/User.js";
import { Post } from "../models/Post.js";

function sendAggregationResponse(res, endpoint, data) {
  return res.json({
    endpoint,
    count: data.length,
    data,
  });
}

// Which verified users should we feature first when introducing a filtered search?
export async function matchVerifiedUsers(res, req, next) {
  try {
    const pipeline = [
      {
        $match: {
          isVerified: true,
        },
      },
      {
        $project: {
          name: 1,
          username: 1,
          city: 1,
          followersCount: 1,
          isVerified: 1,
        },
      },
      {
        $sort: {
          folloersCount: -1,
        },
      },
    ];

    const users = await User.aggregate(pipeline);
    return sendAggregationResponse(res, "match-verified-users", users);
  } catch (error) {
    next(error);
  }
}

//Which post actegories generate the most activity overall?
export async function groupPostsByCategory(req, res, next) {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$category",
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: "$likesCount" },
          totalComments: { $sum: "$commentsCount" },
        },
      },
      {
        $sort: {
          totalLikes: -1,
        },
      },
    ];

    const categories = await Post.aggregate(pipeline);
    return sendAggregationResponse(res, "group-posts-by-category", categories);
  } catch (error) {
    next(error);
  }
}

//What does a compact user profile look like when we only need display fields?
export async function projectUserOverview(req,res,next){
    try {
        const pipeline = [
            {
                $project:{
                    _id:0,
                    name:1,
                    username:1,
                    city:1,
                    follwersCount:1,
                    memberSince:'$joinedAt',
                    accountType:{
                      $cond:['$isVerified','verified','standard'],
                    }
                }
            },
            {
              $sort:{
                followersCount:-1,
              }
            }
        ]
        
        const users = await User.aggregate(pipeline);
        return sendAggregationResponse(res,'project-user-overview',users);
    } catch (error) {
        next(error);
    }
}

// Which posts should appear first when we sort by popularity and freshness?
export async function sortTopPosts(req, res, next) {
    try {
        const pipeline = [
            {
                $sort: {
                    likesCount: -1,
                    createdAt: -1,
                },
            },
            {
                $project: {
                    caption: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    category: 1,
                    createdAt: 1,
                },
            },
        ];

        const posts = await Post.aggregate(pipeline);
        return sendAggregationResponse(res, 'sort-top-posts', posts);
    } catch (error) {
        next(error);
    }
}