import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shama Landscapes CMS')
    .items([
      S.listItem()
        .title('Blog')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Community & Engagement')
        .icon(() => '💬')
        .child(
          S.list()
            .title('Engagement Management')
            .items([
              S.documentTypeListItem('comment').title('Comments'),
              S.documentTypeListItem('like').title('Likes'),
              S.documentTypeListItem('submission').title('Rooted by Shama'),
              S.documentTypeListItem('newsletterSubscriber').title('Newsletter'),
              S.documentTypeListItem('lead').title('Lead Tracking'),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author', 'comment', 'like', 'submission', 'newsletterSubscriber', 'lead'].includes(item.getId()!),
      ),
    ])