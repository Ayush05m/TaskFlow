import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import type { TaskWithTypedAssignees } from "@/db/schema"
import { Calendar, User, Clock } from "lucide-react"

type TaskCardProps = {
  task: TaskWithTypedAssignees
  className?: string
}

export function TaskCard({ task, className }: TaskCardProps) {
  const dueDate = task.dueDate
  const isOverdue = new Date(dueDate) < new Date() && task.status !== "completed"
  const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  // Get all assignees
  const allAssignees = task.assignees || []
  const hasMultipleAssignees = allAssignees.length > 1
  
  const assignerName = task.assignerName
  const updatedAt = task.updatedAt

  return (
    <Card
      className={`task-card h-full group hover:shadow-xl transition-all duration-300 hover:border-primary/20 ${className} ${isOverdue ? "border-destructive/50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end">
            <PriorityBadge priority={task.priority as "low" | "medium" | "high"} />
            {hasMultipleAssignees && (
              <Badge variant="secondary" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                {allAssignees.length} Assignees
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-3 mt-2">{task.description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3 task-card-content space-y-3">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            <span
              className={`font-medium ${isOverdue ? "text-destructive" : daysUntilDue <= 3 ? "text-yellow-600" : ""}`}
            >
              {new Date(dueDate).toLocaleDateString()}
              {isOverdue && <span className="ml-1 text-xs">(Overdue)</span>}
              {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                <span className="ml-1 text-xs">({daysUntilDue} days left)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned by:</span>
            <span className="font-medium">{assignerName}</span>
          </div>

          <div className="space-y-2">
            {allAssignees.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {hasMultipleAssignees ? "Assigned to:" : "Assigned to:"}
                  </span>
                  {!hasMultipleAssignees ? (
                    <span className="font-medium text-primary">{allAssignees[0].name}</span>
                  ) : (
                    <span className="font-medium text-primary">
                      {allAssignees[0].name}
                      {allAssignees.length > 1 && (
                        <span className="text-muted-foreground ml-1">
                          +{allAssignees.length - 1} more
                        </span>
                      )}
                    </span>
                  )}
                </div>
                
                {hasMultipleAssignees && (
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>All Assignees ({allAssignees.length}):</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {allAssignees.map((assignee, index) => (
                        <div key={`${assignee.id}-${assignee.assignedAt}`} className="text-xs flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {assignee.name}
                          </span>
                          <span className="text-muted-foreground">
                            - {new Date(assignee.assignedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Unassigned</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>
            </div>
            <StatusBadge status={task.status as "pending" | "in-progress" | "completed"} />
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Updated {updatedAt?.toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/dashboard/tasks/${task.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 focus-ring"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
