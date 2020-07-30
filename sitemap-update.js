const fs = require('fs'),
    convert = require('xml-js'),
    fetch = require('node-fetch'),
    moment = require('moment'),
    hostBlogBaseURL = 'https://stfuniversal.cubettech.in',
    getBlogsListURL = `https://stf.cubettech.in/api/fetchSiteMapUrl`,
    untrackedUrlsList = [],
    options = { compact: true, ignoreComment: true, spaces: 4 };

/* 
    Method to Fetch dynamic List of URLs from Rest API/DB 
*/
const fetchBlogsList = () => {
 const urlexplode=['/messages','/all-stf-entries'];
    fetch(getBlogsListURL)
        .then(res => res.json())
        .then(dataJSON => {
            if (dataJSON) {
                dataJSON.urls.forEach(element => {
                    const modifiedURL = element.url.replace(/ /g, '-');
                    if(!urlexplode.includes(modifiedURL)){
                      untrackedUrlsList.push(`${hostBlogBaseURL}${modifiedURL}`);
                    }
                });
                filterUniqueURLs();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

/* 
    Method to Filter/Unique already existing URLs and new urls we fetched from DB
*/
const filterUniqueURLs = () => {
    fs.readFile('browser/sitemap.xml', (err, data) => {
        if (data) {
            const existingSitemapList = JSON.parse(convert.xml2json(data, options));
            let existingSitemapURLStringList = [];
            if (existingSitemapList.urlset && existingSitemapList.urlset.url && existingSitemapList.urlset.url.length) {
                existingSitemapURLStringList = existingSitemapList.urlset.url.map(ele => ele.loc._text);
            }

            untrackedUrlsList.forEach(ele => {
                if (existingSitemapURLStringList.indexOf(ele) == -1) {
                    existingSitemapList.urlset.url.push({
                        loc: {
                            _text: ele,
                        },
                        changefreq: {
                            _text: 'monthly'
                        },
                        priority: {
                            _text: 0.8
                        },
                        lastmod: {
                            _text: moment(new Date()).format('YYYY-MM-DD')
                        }
                    });
                }
            });
            createSitemapFile(existingSitemapList);
        }
    });
}

/* 
    Method to convert JSON format data into XML format
*/
const createSitemapFile = (list) => {
    const finalXML = convert.json2xml(list, options); // to convert json text to xml text
    saveNewSitemap(finalXML);
}

/* 
    Method to Update sitemap.xml file content
*/
const saveNewSitemap = (xmltext) => {
    fs.writeFile('browser/sitemap.xml', xmltext, (err) => {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

fetchBlogsList();