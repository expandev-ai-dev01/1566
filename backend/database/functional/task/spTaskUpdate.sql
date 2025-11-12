/**
 * @summary
 * Updates an existing task with new values for any modifiable fields.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: Task identifier to update
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Updated task title
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Updated task description
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated due date
 *
 * @param {INT} priority
 *   - Required: Yes
 *   - Description: Updated priority
 *
 * @param {NVARCHAR(MAX)} recurrence
 *   - Required: No
 *   - Description: Updated recurrence configuration
 *
 * @param {NVARCHAR(MAX)} attachments
 *   - Required: No
 *   - Description: Updated attachments metadata
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: Updated tags
 *
 * @param {INT} estimatedTime
 *   - Required: No
 *   - Description: Updated estimated time
 *
 * @param {NVARCHAR(MAX)} assignedUsers
 *   - Required: No
 *   - Description: Updated assigned users
 *
 * @param {BIT} completed
 *   - Required: Yes
 *   - Description: Updated completion status
 *
 * @testScenarios
 * - Update task with valid data
 * - Validation failure for non-existent task
 * - Validation failure for invalid title
 * - Validation failure for due date in past
 * - Validation failure for invalid priority
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
  @idAccount INTEGER,
  @idTask INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority INTEGER,
  @recurrence NVARCHAR(MAX) = NULL,
  @attachments NVARCHAR(MAX) = NULL,
  @tags NVARCHAR(MAX) = NULL,
  @estimatedTime INTEGER = NULL,
  @assignedUsers NVARCHAR(MAX) = NULL,
  @completed BIT
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
   * @validation Required parameter validation
   * @throw {titleRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'titleRequired', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooShort}
   */
  IF (LEN(LTRIM(RTRIM(@title))) < 3)
  BEGIN
    ;THROW 51000, 'titleTooShort', 1;
  END;

  /**
   * @validation Title length validation
   * @throw {titleTooLong}
   */
  IF (LEN(@title) > 100)
  BEGIN
    ;THROW 51000, 'titleTooLong', 1;
  END;

  /**
   * @validation Due date validation
   * @throw {dueDateCannotBeInPast}
   */
  IF (@dueDate IS NOT NULL AND @dueDate < CAST(GETUTCDATE() AS DATE))
  BEGIN
    ;THROW 51000, 'dueDateCannotBeInPast', 1;
  END;

  /**
   * @validation Priority validation
   * @throw {invalidPriority}
   */
  IF (@priority IS NULL OR @priority < 0 OR @priority > 2)
  BEGIN
    ;THROW 51000, 'invalidPriority', 1;
  END;

  /**
   * @validation Estimated time validation
   * @throw {estimatedTimeOutOfRange}
   */
  IF (@estimatedTime IS NOT NULL AND (@estimatedTime < 5 OR @estimatedTime > 1440))
  BEGIN
    ;THROW 51000, 'estimatedTimeOutOfRange', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-transaction-control} Transaction control for data integrity
     */
    BEGIN TRAN;

      /**
       * @rule {fn-task-update} Update task record
       */
      UPDATE [functional].[task]
      SET
        [title] = @title,
        [description] = @description,
        [dueDate] = @dueDate,
        [priority] = @priority,
        [recurrence] = @recurrence,
        [attachments] = @attachments,
        [tags] = @tags,
        [estimatedTime] = @estimatedTime,
        [assignedUsers] = @assignedUsers,
        [completed] = @completed,
        [dateModified] = GETUTCDATE()
      WHERE [idTask] = @idTask
        AND [idAccount] = @idAccount;

      /**
       * @output {TaskUpdated, 1, 1}
       * @column {INT} rowsAffected - Number of rows updated
       */
      SELECT 1 AS [rowsAffected];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO