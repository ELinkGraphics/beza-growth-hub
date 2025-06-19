
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, Star } from 'lucide-react';

interface ProgressTrackerProps {
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  achievements: string[];
  timeSpent: number; // in minutes
}

export const ProgressTracker = ({
  completedLessons,
  totalLessons,
  streakDays,
  achievements,
  timeSpent
}: ProgressTrackerProps) => {
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Main Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">Course Progress</h3>
              <span className="text-2xl font-bold text-brand-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{streakDays}</p>
              <p className="text-xs text-gray-600">Day Streak</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{Math.floor(timeSpent / 60)}h</p>
              <p className="text-xs text-gray-600">Time Spent</p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">{achievements.length}</p>
              <p className="text-xs text-gray-600">Achievements</p>
            </div>
          </div>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Recent Achievements
              </h4>
              <div className="flex flex-wrap gap-2">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {achievement}
                  </Badge>
                ))}
                {achievements.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{achievements.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
