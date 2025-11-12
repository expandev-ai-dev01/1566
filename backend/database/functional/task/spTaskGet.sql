/**
 * @summary
 * Retrieves detailed information for a specific task including all fields.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier
 *
 * @testScenarios
 * - Retrieve existing task successfully
 * - Validation failure for non-existent task
 * - Security validation for task from different account
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
  @idAccount INTEGER,
  @idTask INTEGER
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
   * @throw {idTaskRequired}
   */
  IF (@idTask IS NULL)
  BEGIN
    ;THROW 51000, 'idTaskRequired', 1;
  END;

  /**
   * @validation Data consistency validation
   * @throw {taskDoesNotExist}
   */
  IF NOT EXISTS (
    SELECT *
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idTask] = @idTask
      AND [tsk].[idAccount] = @idAccount
      AND [tsk].[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'taskDoesNotExist', 1;
  END;

  /**
   * @output {TaskDetail, 1, n}
   * @column {INT} idTask - Task identifier
   * @column {INT} idUser - User identifier
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
    [tsk].[idUser],
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
  WHERE [tsk].[idTask] = @idTask
    AND [tsk].[idAccount] = @idAccount
    AND [tsk].[deleted] = 0;
END;
GO