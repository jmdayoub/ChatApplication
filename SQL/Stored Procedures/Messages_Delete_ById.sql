USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Delete_ById]    Script Date: 10/22/2022 12:41:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Author: Jared Dayoub
-- Create date: 09/27/2022
-- Description: Messages DeleteById
-- Code Reviewer: TBD

-- MODIFIED BY: author
-- MODIFIED DATE:09/27/2022
-- Code Reviewer: TBD
-- Note:

ALTER proc [dbo].[Messages_Delete_ById]
		@Id int
		,@SenderId int
as

/*
	
	Declare @Id int = 5;

	Select * 
	FROM dbo.Messages
	WHERE Id = @Id;

	Execute [dbo].[Messages_Delete_ById] @Id

	Select *
	FROM dbo.Messages
	WHERE Id = @Id;

*/

BEGIN

	SELECT m.Id
		,RecipientId
	FROM dbo.Messages as m
	WHERE @Id = m.Id

	DELETE FROM [dbo].[Messages]
	WHERE Id = @Id AND SenderId = @SenderId

END