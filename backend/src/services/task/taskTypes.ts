/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idUser - User identifier who created the task
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {Date | null} dueDate - Task due date
 * @property {number} priority - Task priority (0=Low, 1=Medium, 2=High)
 * @property {string | null} recurrence - Recurrence configuration JSON
 * @property {string | null} attachments - Attachments metadata JSON
 * @property {string | null} tags - Task tags JSON
 * @property {number | null} estimatedTime - Estimated time in minutes
 * @property {string | null} assignedUsers - Assigned users JSON
 * @property {boolean} completed - Completion status
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idUser: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number;
  recurrence: string | null;
  attachments: string | null;
  tags: string | null;
  estimatedTime: number | null;
  assignedUsers: string | null;
  completed: boolean;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Task title
 * @property {string} [description] - Task description
 * @property {Date} [dueDate] - Task due date
 * @property {number} [priority] - Task priority
 * @property {string} [recurrence] - Recurrence configuration
 * @property {string} [attachments] - Attachments metadata
 * @property {string} [tags] - Task tags
 * @property {number} [estimatedTime] - Estimated time in minutes
 * @property {string} [assignedUsers] - Assigned users
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: number;
  recurrence?: string | null;
  attachments?: string | null;
  tags?: string | null;
  estimatedTime?: number | null;
  assignedUsers?: string | null;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} [completed] - Filter by completion status
 * @property {number} [priority] - Filter by priority
 * @property {Date} [dueDateFrom] - Filter by due date from
 * @property {Date} [dueDateTo] - Filter by due date to
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  completed?: number;
  priority?: number;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for getting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskGetRequest {
  idAccount: number;
  idTask: number;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 * @property {string} title - Task title
 * @property {string} [description] - Task description
 * @property {Date} [dueDate] - Task due date
 * @property {number} priority - Task priority
 * @property {string} [recurrence] - Recurrence configuration
 * @property {string} [attachments] - Attachments metadata
 * @property {string} [tags] - Task tags
 * @property {number} [estimatedTime] - Estimated time in minutes
 * @property {string} [assignedUsers] - Assigned users
 * @property {number} completed - Completion status
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idTask: number;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: number;
  recurrence?: string | null;
  attachments?: string | null;
  tags?: string | null;
  estimatedTime?: number | null;
  assignedUsers?: string | null;
  completed: number;
}

/**
 * @interface TaskDeleteRequest
 * @description Request parameters for deleting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskDeleteRequest {
  idAccount: number;
  idTask: number;
}
