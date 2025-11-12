/**
 * @summary
 * Creates a new task with all specified parameters including optional fields
 * for description, due date, priority, recurrence, attachments, tags, estimated time,
 * and assigned users.
 *
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier who is creating the task
 *
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: Task title (3-100 characters)
 *
 * @param {NVARCHAR(1000)} description
 *   - Required: No
 *   - Description: Detailed task description
 *
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Task due date (cannot be in the past)
 *
 * @param {INT} priority
 *   - Required: No
 *   - Description: Task priority (0=Low, 1=Medium, 2=High)
 *
 * @param {NVARCHAR(MAX)} recurrence
 *   - Required: No
 *   - Description: JSON string with recurrence configuration
 *
 * @param {NVARCHAR(MAX)} attachments
 *   - Required: No
 *   - Description: JSON array of attachment metadata
 *
 * @param {NVARCHAR(MAX)} tags
 *   - Required: No
 *   - Description: JSON array of tags
 *
 * @param {INT} estimatedTime
 *   - Required: No
 *   - Description: Estimated time in minutes (5-1440)
 *
 * @param {NVARCHAR(MAX)} assignedUsers
 *   - Required: No
 *   - Description: JSON array of assigned user IDs
 *
 * @returns {INT} idTask - Created task identifier
 *
 * @testScenarios
 * - Valid creation with only required fields (title)
 * - Valid creation with all optional fields
 * - Validation failure for empty title
 * - Validation failure for title too short (< 3 characters)
 * - Validation failure for title too long (> 100 characters)
 * - Validation failure for due date in the past
 * - Validation failure for invalid priority value
 * - Validation failure for estimated time out of range
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(1000) = NULL,
  @dueDate DATE = NULL,
  @priority INTEGER = 1,
  @recurrence NVARCHAR(MAX) = NULL,
  @attachments NVARCHAR(MAX) = NULL,
  @tags NVARCHAR(MAX) = NULL,
  @estimatedTime INTEGER = NULL,
  @assignedUsers NVARCHAR(MAX) = NULL
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
  IF (@priority IS NOT NULL AND (@priority < 0 OR @priority > 2))
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
       * @rule {fn-task-creation} Insert new task record
       */
      INSERT INTO [functional].[task] (
        [idAccount],
        [idUser],
        [title],
        [description],
        [dueDate],
        [priority],
        [recurrence],
        [attachments],
        [tags],
        [estimatedTime],
        [assignedUsers],
        [completed],
        [dateCreated],
        [dateModified],
        [deleted]
      )
      VALUES (
        @idAccount,
        @idUser,
        @title,
        @description,
        @dueDate,
        @priority,
        @recurrence,
        @attachments,
        @tags,
        @estimatedTime,
        @assignedUsers,
        0,
        GETUTCDATE(),
        GETUTCDATE(),
        0
      );

      /**
       * @output {TaskCreated, 1, 1}
       * @column {INT} idTask - Created task identifier
       */
      SELECT SCOPE_IDENTITY() AS [idTask];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO