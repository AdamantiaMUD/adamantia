import React, {FC} from 'react';
import {PageRendererProps} from 'gatsby';

import Layout from '../components/layout';
import PageTitle from '../components/general/page-title';
import SEO from '../components/seo';

export const IndexPage: FC<PageRendererProps> = ({location}: PageRendererProps) => (
    <Layout location={location}>
        <SEO title="Home" />
        <PageTitle>Home</PageTitle>
        <h3>Node.js-based MUD engine</h3>
        <p>
            Adamantia is a MUD game engine whose goal is to be a simple but
            powerful way to build whatever MUD you want with special care given to
            extensibility. The core code strives to be completely unopinionated
            toward any specific style of game while using the bundle system to build
            the game you want without having to dig through the engine{'\u0027'}s code.
        </p>

        <h3>Special Features</h3>
        <ul>
            <li>
                Robust bundle system: Nearly every aspect of the game can be
                modified without changing the core and allows for easy packaging
                and sharing of commands/areas/items/npcs/channels/behaviors
            </li>
            <li>
                Unopinionated network layer: easily swap out telnet for any
                network layer you like. No need to gut the whole codebase just
                to support a different transport type, just drop in a file.
            </li>
            <li>
                Scripting for all entities in the game for any event along with
                behaviors to create shared, composable scripts
            </li>
            <li>Skill system with passive/active skills</li>
            <li>Effects e.g., buffs/debuffs</li>
            <li>
                Quest system allowing for starting/progress/completion from any
                event in the game
            </li>
            <li>Communication channels with custom audiences</li>
        </ul>

        <h3>Requirements</h3>
        <p>Node.js {'\u2265'} v12.0</p>
    </Layout>
);

export default IndexPage;
