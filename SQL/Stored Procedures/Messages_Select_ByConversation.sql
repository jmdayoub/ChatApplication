USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByConversation]    Script Date: 10/22/2022 12:40:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Author: Jared Dayoub
-- Create date: 09/30/2022
-- Description: Messages SelectByConversation
-- Code Reviewer: TBD

-- MODIFIED BY: author
-- MODIFIED DATE:09/30/2022
-- Code Reviewer: TBD
-- Note:

ALTER proc [dbo].[Messages_Select_ByConversation]
		@SenderId int

as

/*
	
	Declare @SenderId int = 73;

	Execute [dbo].[Messages_Select_ByConversation] @SenderId

*/

BEGIN

	SELECT DISTINCT m.[Id]
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
	FROM [dbo].[Messages] as m 
	inner join dbo.Users as sender on m.SenderId = sender.Id
	inner join dbo.Users as recipient on m.RecipientId = recipient.Id
	WHERE  recipient.Id = @SenderId OR sender.Id = @SenderId

	Order by m.DateSent ASC
END