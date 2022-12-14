USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Update]    Script Date: 10/19/2022 3:30:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Author: Jared Dayoub
-- Create date: 09/26/2022
-- Description: Messages Update
-- Code Reviewer: TBD

-- MODIFIED BY: author
-- MODIFIED DATE:09/26/2022
-- Code Reviewer: TBD
-- Note:

ALTER proc [dbo].[Messages_Update]
						@Message nvarchar(1000)
						,@Subject nvarchar(100)
						,@Id int

as

/*

	Declare @Id int = 3;

	Select *
	FROM dbo.Messages
	Where Id = @Id

	Declare @Message nvarchar(1000) = 'How are you doing?'
			,@Subject nvarchar(100) = 'Hello'
			,@DateSent datetime2(7) = '2022-09-26'

	Execute [dbo].[Messages_Update]
								@Message
								,@Subject
								,@Id

	Select *
	FROM dbo.Messages
	Where Id = @Id

*/

BEGIN

	UPDATE [dbo].[Messages]

	SET [Message] = @Message
		,[Subject] = @Subject
		,[DateModified] = GETUTCDATE()

	 WHERE Id = @Id

END