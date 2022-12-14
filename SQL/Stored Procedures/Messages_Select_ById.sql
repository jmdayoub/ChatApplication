USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ById]    Script Date: 10/22/2022 12:41:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- Author: Jared Dayoub
-- Create date: 09/27/2022
-- Description: Messages SelectById
-- Code Reviewer: TBD

-- MODIFIED BY: author
-- MODIFIED DATE:09/27/2022
-- Code Reviewer: TBD
-- Note:

ALTER proc [dbo].[Messages_Select_ById]
		@Id int

as

/*
	
	Declare @Id int = 7;

	Execute [dbo].[Messages_Select_ById] @Id

	Select *
	FROM dbo.Messages

*/

BEGIN

	SELECT m.[Id]
      ,m.[Message]
      ,m.[Subject]
      ,m.[RecipientId]
      ,m.[SenderId]
	  ,sender.FirstName as senderFirstName
	  ,sender.LastName as senderLastName
	  ,sender.AvatarUrl as senderAvatar
	  ,recipient.FirstName as recipientFirstName
	  ,recipient.LastName as recipientLastName
	  ,recipient.AvatarUrl as recipientAvatar
      ,m.[DateSent]
      ,m.[DateRead]
      ,[DateSent]
      ,[DateRead]
	  
	FROM [dbo].[Messages] as m 
	inner join dbo.Users as sender on m.SenderId = sender.Id
	inner join dbo.Users as recipient on m.RecipientId = recipient.Id
	WHERE m.Id = @Id

END
