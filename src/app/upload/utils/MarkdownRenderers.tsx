import React from 'react';
import { Box, Flex, Text, Image, Link, VStack, HStack, Badge, color } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios'; // Import AxiosResponse
import { useState, useEffect } from 'react';

type MarkdownProps = {
  node?: any;
  alt?: any;
  src?: any;
  title?: any;
};

type RendererProps = MarkdownProps & {
  children?: React.ReactNode;
  ordered?: any;
  href?: any; // Add this line to include href in RendererProps
};
type FetchedDetailsObject = {
  [key: string]: PostDetails;
};
type PostDetails = {
  post_id: number;
  author: string;
  permlink: string;
  category: string;
  title: string;
  body: string;
  json_metadata: {
    tags: string[];
    users: string[];
    image: string[];
    links: string[];
    app: string;
    format: string;
    description: string;
  };
  created: string;
  updated: string;
  depth: number;
  children: number;
  net_rshares: number;
  is_paidout: boolean;
  payout_at: string;
  payout: number;
  pending_payout_value: string;
  author_payout_value: string;
  curator_payout_value: string;
  promoted: string;
  replies: any[];
  author_reputation: number;
  stats: {
    hide: boolean;
    gray: boolean;
    total_votes: number;
    flag_weight: number;
  };
  url: string;
  beneficiaries: any[];
  max_accepted_payout: string;
  percent_hbd: number;
  active_votes: any[];
  newProperty: string;
};

// const getPost = async (author: string, permlink: string): Promise<PostDetails | null> => {
//   try {
//     const response: AxiosResponse = await axios.post('https://api.hive.blog/', {
//       jsonrpc: '2.0',
//       id: 1,
//       method: 'bridge.get_discussion',
//       params: [author, permlink],
//     });
//     if (response.status === 200 && response.data.result) {
//       return response.data.result as PostDetails;
//     } else {
//       console.error('Failed to fetch post details:', response.status, response.data.error);
//       return null;
//     }
//   } catch (error: any) {
//     console.error('Error fetching post details:', error.message);
//     return null;
//   }
// };

export const MarkdownRenderers = {
  img: ({ alt, src, title, ...props }: RendererProps) => {
    // if the image is inline, it will have position start column > 1
    let isInline = false;
    if (props.node.position.start.column > 1) {
      isInline = true;
    }

    let image = (
      <Image
        {...props}
        alt={alt}
        src={src}
        title={title}
        style={{
          display: 'inline-block',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '10px',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      // onError={(e) => {
      //   // Handle image loading error by replacing the source with a default image
      //   e.currentTarget.src = 'https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafkreidxxr42k6sff4ppctl4l3xvh52rf2m7vzdrjmyqhoijveevwafkau&w=3840&q=75'; // Replace with the URL of your default image
      // }}
      />
    );

    if (isInline) {
      return image;
    }

    return (
      <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        {image}
      </span>
    );
  },
  p: ({ children, ...props }: RendererProps) => <p {...props} style={{ color: 'white', fontSize: '18px', paddingBottom: '15px', paddingLeft: '10px' }}>{children}</p>,
  a: ({ href, children, ...props }: RendererProps) => {
    return <Link color={"yellow.200"} href={href}  {...props} > {children} </Link>;
  },
  h1: ({ children, ...props }: RendererProps) => <h1 {...props} style={{ fontWeight: 'bold', color: '#00ff55', fontSize: '28px', paddingBottom: '10px', paddingTop: "10px", paddingLeft: '10px' }}>{children}</h1>,
  h3: ({ children, ...props }: RendererProps) => <h3 {...props} style={{ fontWeight: 'bold', color: '#00ff55', fontSize: '24px', paddingBottom: '6px', paddingTop: "12px", paddingLeft: '10px' }}>{children}</h3>,
  h2: ({ children, ...props }: RendererProps) => <h2 {...props} style={{ fontWeight: 'bold', color: '#00ff55', fontSize: '26px', paddingBottom: '8px', paddingTop: "10px", paddingLeft: '10px' }}>{children}</h2>,
  h4: ({ children, ...props }: RendererProps) => <h4 {...props} style={{ fontWeight: 'bold', color: '#00ff55', fontSize: '22px', paddingBottom: '6px', paddingTop: "12px", paddingLeft: '10px' }}>{children}</h4>,
  blockquote: ({ children, ...props }: RendererProps) => (
    <div
      style={{
        backgroundColor: '#004d1a',
        padding: '10px',
        borderLeft: '4px solid  #00ff55',
        margin: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '1',
      }}
    >

      {children}


    </div>
  ),
  ol: ({ ordered, children, ...props }: RendererProps) => {
    const listType = ordered ? "1" : "decimal";
    return <ol {...props} style={{ listStyleType: listType, paddingLeft: '10%' }}>{children}</ol>;
  },
  ul: ({ ordered, children, ...props }: RendererProps) => {
    const listType = ordered ? "1" : "decimal";
    return <ul {...props} data-ordered={listType} style={{ padding: '5%', paddingLeft: '10%', color: 'white' }}>{children}</ul>;
  },
  sub: ({ children, ...props }: RendererProps) => (<sub {...props} style={{ color: 'gray' }}>{children}</sub>),
  hr: ({ children, ...props }: RendererProps) => <hr {...props} style={{ paddingBottom: '20px', color: 'yellow' }}>{children}</hr>,
  br: ({ children, ...props }: RendererProps) => <br {...props} style={{ paddingBottom: '20px' }}>{children}</br>,
  pre: ({ children, ...props }: RendererProps) => (
    <div
      style={{
        backgroundColor: '#1E1E1E', // Dark gray background
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        overflowX: 'auto', // Horizontal scrollbar for long code lines
      }}
    >
      <center>

        <code
          {...props}
          style={{
            color: 'red', // Light gray text color
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          {children}
        </code>
      </center>
    </div>
  ),
  iframe: ({ src, ...props }: RendererProps) => (
    <center>

      <iframe
        {...props}
        src={src}
        style={{ borderRadius: '20px', marginBottom: '10px', minWidth: '100%', aspectRatio: '16/9', height: '100%', border: '2px limegreen solid' }}
      />
    </center>
  ),
  video: ({ src, ...props }: RendererProps) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', minWidth: '100%', minHeight: 'auto' }}>
      <video
        {...props}
        src={src}
        style={{ borderRadius: '10px', marginBottom: '20px', border: '2px grey solid', minWidth: '7s0%', minHeight: '50%' }}
      />
    </div>
  ),
  table: ({ children, ...props }: RendererProps) => (
    <div style={{
      display: 'flex', justifyContent: 'center',
      border: '1px solid none',
      borderRadius: '10px',
      padding: '10px',
    }}>
      <table
        {...props}
        style={{
          border: '1px solid transparent',
          borderCollapse: 'collapse',
          margin: '0 auto',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {children}
      </table>
    </div>
  ),
  tbody: ({ children, ...props }: RendererProps) => (
    <tbody {...props}>{children}</tbody>
  ),
  tr: ({ children, ...props }: RendererProps) => (
    <tr {...props}>{children}</tr>
  ),
  th: ({ children, ...props }: RendererProps) => (
    <th
      {...props}
      style={{
        border: '1px solid black',
        backgroundColor: '#009933',
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#004d1a',
      }}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: RendererProps) => (
    <td
      {...props}
      style={{
        border: '1px solid limegreen',
        backgroundColor: '#001a09',
        padding: '8px',
        textAlign: 'left',
        color: '#00ff55',
      }}
    >
      {children}
    </td>

  ),
  strong: ({ children, ...props }: RendererProps) => (
    <strong {...props} style={{ color: '#00ff55' }}>{children}</strong>
  ),
  code: ({ children, ...props }: RendererProps) => (
    <code {...props} style={{ color: 'limegreen', backgroundColor: '#001a09', padding: '2px', borderRadius: '4px' }}>{children}</code>
  ),
};
