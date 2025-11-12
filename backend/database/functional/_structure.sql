/**
 * @schema functional
 * Business logic schema for task management system
 */
CREATE SCHEMA [functional];
GO

/**
 * @table task Task management table
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(1000) NULL,
  [dueDate] DATE NULL,
  [priority] INTEGER NOT NULL,
  [recurrence] NVARCHAR(MAX) NULL,
  [attachments] NVARCHAR(MAX) NULL,
  [tags] NVARCHAR(MAX) NULL,
  [estimatedTime] INTEGER NULL,
  [assignedUsers] NVARCHAR(MAX) NULL,
  [completed] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table subtask Subtask management table
 * @multitenancy true
 * @softDelete true
 * @alias sbtsk
 */
CREATE TABLE [functional].[subtask] (
  [idSubtask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idTask] INTEGER NOT NULL,
  [title] NVARCHAR(100) NOT NULL,
  [completed] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @table taskTemplate Task template management table
 * @multitenancy true
 * @softDelete true
 * @alias tskTpl
 */
CREATE TABLE [functional].[taskTemplate] (
  [idTemplate] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [templateData] NVARCHAR(MAX) NOT NULL,
  [public] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [dateModified] DATETIME2 NOT NULL DEFAULT (GETUTCDATE()),
  [deleted] BIT NOT NULL DEFAULT (0)
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @primaryKey pkSubtask
 * @keyType Object
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [pkSubtask] PRIMARY KEY CLUSTERED ([idSubtask]);
GO

/**
 * @primaryKey pkTaskTemplate
 * @keyType Object
 */
ALTER TABLE [functional].[taskTemplate]
ADD CONSTRAINT [pkTaskTemplate] PRIMARY KEY CLUSTERED ([idTemplate]);
GO

/**
 * @foreignKey fkSubtask_Task Subtask belongs to task
 * @target functional.task
 */
ALTER TABLE [functional].[subtask]
ADD CONSTRAINT [fkSubtask_Task] FOREIGN KEY ([idTask])
REFERENCES [functional].[task]([idTask]);
GO

/**
 * @check chkTask_Priority Task priority validation
 * @enum {0} Low priority
 * @enum {1} Medium priority
 * @enum {2} High priority
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_EstimatedTime Estimated time validation
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_EstimatedTime] CHECK ([estimatedTime] IS NULL OR ([estimatedTime] >= 5 AND [estimatedTime] <= 1440));
GO

/**
 * @index ixTask_Account Multi-tenancy account isolation
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_User Task filtering by user
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_User]
ON [functional].[task]([idAccount], [idUser])
INCLUDE ([title], [dueDate], [priority], [completed])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_DueDate Task filtering by due date
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_DueDate]
ON [functional].[task]([idAccount], [dueDate])
INCLUDE ([title], [priority], [completed])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Account_Priority Task filtering by priority
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Account_Priority]
ON [functional].[task]([idAccount], [priority])
INCLUDE ([title], [dueDate], [completed])
WHERE [deleted] = 0;
GO

/**
 * @index ixSubtask_Account Multi-tenancy account isolation
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account]
ON [functional].[subtask]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixSubtask_Account_Task Subtask filtering by task
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixSubtask_Account_Task]
ON [functional].[subtask]([idAccount], [idTask])
INCLUDE ([title], [completed])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account Multi-tenancy account isolation
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account]
ON [functional].[taskTemplate]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account_User Template filtering by user
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account_User]
ON [functional].[taskTemplate]([idAccount], [idUser])
INCLUDE ([name], [public])
WHERE [deleted] = 0;
GO

/**
 * @index ixTaskTemplate_Account_Public Public template filtering
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTaskTemplate_Account_Public]
ON [functional].[taskTemplate]([idAccount], [public])
INCLUDE ([name])
WHERE [deleted] = 0;
GO