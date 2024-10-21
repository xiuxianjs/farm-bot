import { LinkStyleSheet } from 'jsxp'
import React from 'react'
import css_output from '@src/assets/main.css'
import data from 'src/assets/config/help.json'
export default () => {
  return (
    <html>
      <head>
        <LinkStyleSheet src={css_output} />
      </head>
      <body>
        <div id="zoomable" className="help">
          <div className="h-12"></div>
          {data &&
            data.map(val => (
              <div key={val.group} className="cont-box">
                <div className="help-group">{val.group}</div>
                <div className="help-table">
                  <div className="tr">
                    {val.list.map(item => (
                      <div key={item.title} className="td">
                        <strong className="help-title">{item.title}</strong>
                        <span className="help-desc">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          <div className="copyright">
            <span> Group 农场 @1.0 | </span>
            <span className="version">LEMONADE</span>
          </div>
        </div>
      </body>
    </html>
  )
}
