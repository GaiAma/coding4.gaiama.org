const { resolve } = require(`path`)
const {
  branch,
  isNetlifyProduction,
  siteUrl,
  isDebug,
} = require(`../src/utils/environment-helpers.js`)

module.exports = async function createPages({ graphql, actions }) {
  const { createPage } = actions
  const result = await graphql(`
    {
      allMdx {
        nodes {
          frontmatter {
            layout
            type
          }
          fields {
            url
            lang
            slug
          }
        }
      }
    }
  `)

  result.data.allMdx.nodes.forEach(node => {
    const { layout, draft, type } = node.frontmatter
    const { lang, url, slug } = node.fields

    // no layout? not a page
    // isProduction && draft? don't create page!
    if (!layout || (isNetlifyProduction && draft)) {
      return
    }

    const page = {
      path: url,
      component: resolve(`./src/templates/${layout}.js`),
      // customizable layout
      // layout: resolve(`./src/templates/${layout}.js`),
      context: {
        url,
        lang,
        // draftBlacklist by https://github.com/gatsbyjs/gatsby/issues/12460#issuecomment-471376629
        draftBlacklist: isNetlifyProduction ? [true] : [],
      },
    }

    // localized and root error pages
    if (type === `error`) {
      if (lang === `en`) {
        createPage({
          ...page,
          path: `/${slug}`,
          matchPath: `/*`,
        })
      }
      page.matchPath = `/${lang}/*`
    }

    createPage(page)
  })
}
