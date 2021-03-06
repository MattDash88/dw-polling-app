import Head from 'next/head';

export default class Header extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel="manifest" type="image/x-icon" href="/static/manifest.json" />    
                    <link rel="shortcut icon" type="image/x-icon" href="/static/icons/favicon.ico" />                    
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                    <title>Dash Watch Polling app</title>
                </Head>
            </div>
        )
    }
}