/**
 * @summary
 * Retrieves a list of tasks for a specific account and user with optional filtering
 * by completion status, priority, and due date range.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier to filter tasks
 *
 * @param {BIT} completed
 *   - Required: No
 *   - Description: Filter by completion status (0=incomplete, 1=complete, NULL=all)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Filter by priority (0=Low, 1=Medium, 2=High, NULL=all)
 *
 * @param {DATE} dueDateFrom
 *   - Required: No
 *   - Description: Filter tasks with due date from this date
 *
 * @param {DATE} dueDateTo
 *   - Required: No
 *   - Description: Filter tasks with due date until this date
 *
 * @testScenarios
 * - List all tasks for user without filters
 * - List only completed tasks
 * - List only incomplete tasks
 * - List tasks by specific priority
 * - List tasks within date range
 * - List tasks with multiple filters combined
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
  @idAccount INTEGER,
  @idUser INTEGER,
  @completed BIT = NULL,
  @priority INTEGER = NULL,
  @dueDateFrom DATE = NULL,
  @dueDateTo DATE = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF (@idAccount IS NULL)
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF (@idUser IS NULL)
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @output {TaskList, n, n}
   * @column {INT} idTask - Task identifier
   * @column {NVARCHAR} title - Task title
   * @column {NVARCHAR} description - Task description
   * @column {DATE} dueDate - Task due date
   * @column {INT} priority - Task priority
   * @column {NVARCHAR} recurrence - Recurrence configuration
   * @column {NVARCHAR} attachments - Attachments metadata
   * @column {NVARCHAR} tags - Task tags
   * @column {INT} estimatedTime - Estimated time in minutes
   * @column {NVARCHAR} assignedUsers - Assigned users
   * @column {BIT} completed - Completion status
   * @column {DATETIME2} dateCreated - Creation timestamp
   * @column {DATETIME2} dateModified - Last modification timestamp
   */
  SELECT
    [tsk].[idTask],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[recurrence],
    [tsk].[attachments],
    [tsk].[tags],
    [tsk].[estimatedTime],
    [tsk].[assignedUsers],
    [tsk].[completed],
    [tsk].[dateCreated],
    [tsk].[dateModified]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idAccount] = @idAccount
    AND [tsk].[idUser] = @idUser
    AND [tsk].[deleted] = 0
    AND (@completed IS NULL OR [tsk].[completed] = @completed)
    AND (@priority IS NULL OR [tsk].[priority] = @priority)
    AND (@dueDateFrom IS NULL OR [tsk].[dueDate] >= @dueDateFrom)
    AND (@dueDateTo IS NULL OR [tsk].[dueDate] <= @dueDateTo)
  ORDER BY
    [tsk].[priority] DESC,
    [tsk].[dueDate] ASC,
    [tsk].[dateCreated] DESC;
END;
GO