USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_UsersInConvos]    Script Date: 10/22/2022 12:41:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER proc [dbo].[Messages_Select_UsersInConvos]
			@userId int

as

/*

	Declare @userId int = 37;

	Execute [dbo].[Messages_Select_UsersInConvos] @userId

*/

BEGIN

	SELECT DISTINCT u.[Id]
		  ,u.[Title]
		  ,u.[FirstName]
		  ,u.[LastName]
		  ,u.[Mi]
		  ,u.[AvatarUrl]
	  FROM [dbo].[Users] as u
	  join dbo.[Messages] as m on m.SenderId = u.Id  or m.RecipientId = u.Id
	  Where m.SenderId = @userId or m.RecipientId = @userId

END

